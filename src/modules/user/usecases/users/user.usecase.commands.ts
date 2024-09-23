import {
  FileManagerService,
  FileManagerHelper,
} from '@libs/common/file-manager';
import { FileDto } from '@libs/common/file-dto';
import { FileResponseDto } from '@libs/common/file-manager/dtos/file-response.dto';
import { MODELS, ACTIONS } from '@libs/common/constants';
import { CredentialType } from '@libs/common/enums';
import { CreateAccountCommand } from '@account/usecases/accounts/account.commands';
import { AccountCommands } from '@account/usecases/accounts/account.usecase.commands';
import {
  ArchiveUserCommand,
  CreateUserCommand,
  UpdateUserCommand,
} from './user.commands';
import { UserRepository } from '@user/persistence/users/user.repository';
import { UserResponse } from './user.response';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserInfo } from '@account/dtos/user-info.dto';
import { Util } from '@libs/common/util';
import { ActivityRepository } from '@activity-logger/persistence/activities/activity.repository';
@Injectable()
export class UserCommands {
  constructor(
    private userRepository: UserRepository,
    private readonly accountCommands: AccountCommands,
    private eventEmitter: EventEmitter2,
    private readonly fileManagerService: FileManagerService,
    private activityLoggerRepostory: ActivityRepository,
  ) {}
  async createUser(command: CreateUserCommand): Promise<UserResponse> {
    if (
      await this.userRepository.getOneBy(
        'phoneNumber',
        command.phoneNumber,
        [],
        true,
      )
    ) {
      throw new BadRequestException(
        `Employee already exist with this phone number`,
      );
    }
    if (
      command.email &&
      (await this.userRepository.getOneBy('email', command.email, [], true))
    ) {
      throw new BadRequestException(
        `Employee already exist with this email Address`,
      );
    }
    const userDomain = CreateUserCommand.fromCommand(command);
    const user = await this.userRepository.insert(userDomain);
    if (user) {
      const password = Util.generatePassword(8);
      const createAccountCommand = new CreateAccountCommand();
      createAccountCommand.email = command.email;
      createAccountCommand.phoneNumber = command.phoneNumber;
      createAccountCommand.name = command.name;
      createAccountCommand.accountId = user.id;
      createAccountCommand.type = CredentialType.Employee;
      createAccountCommand.isActive = true;
      createAccountCommand.address = command.address;
      createAccountCommand.gender = command.gender;
      createAccountCommand.password = Util.hashPassword(password);
      const account = await this.accountCommands.createAccount(
        createAccountCommand,
      );
      if (account && account.email) {
        this.accountCommands.sendEmailCredential({
          name: account.name,
          email: account.email,
          phoneNumber: account.phoneNumber,
          password: password,
        });
        // this.eventEmitter.emit('send.email.credential', {
        //   name: account.name,
        //   email: account.email,
        //   phoneNumber: account.phoneNumber,
        //   password: password,
        // });
      }

      this.eventEmitter.emit('activity-logger.store', {
        modelId: user.id,
        modelName: MODELS.USER,
        action: ACTIONS.CREATE,
        userId: command.currentUser.id,
        user: command.currentUser,
      });
    }
    return UserResponse.fromEntity(user);
  }
  async updateUser(command: UpdateUserCommand): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(command.id);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${command.id}`);
    }
    if (command.email) {
      const checkEmail = await this.userRepository.getOneBy(
        'email',
        command.email,
        [],
        true,
      );
      if (checkEmail.id !== userDomain.id)
        throw new BadRequestException(
          `Employee already exist with this email Address`,
        );
    }
    const oldPayload = userDomain;
    userDomain.email = command.email;
    userDomain.name = command.name;
    userDomain.address = command.address;
    userDomain.phoneNumber = command.phoneNumber;
    userDomain.gender = command.gender;
    userDomain.emergencyContact = command.emergencyContact;
    const user = await this.userRepository.update(command.id, userDomain);
    if (user) {
      this.eventEmitter.emit('update.account', {
        accountId: user.id,
        name: user.name,
        email: user.email,
        type: CredentialType.Employee,
        phoneNumber: user.phoneNumber,
        address: user.address,
        gender: user.gender,
        profileImage: user.profileImage,
      });
      this.eventEmitter.emit('activity-logger.store', {
        modelId: user.id,
        modelName: MODELS.USER,
        action: ACTIONS.UPDATE,
        userId: command.currentUser.id,
        user: command.currentUser,
        oldPayload: oldPayload,
        payload: user,
      });
    }
    return UserResponse.fromEntity(user);
  }
  async archiveUser(command: ArchiveUserCommand): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(command.id);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${command.id}`);
    }
    userDomain.deletedAt = new Date();
    userDomain.deletedBy = command.currentUser.id;
    userDomain.archiveReason = command.reason;
    const result = await this.userRepository.update(command.id, userDomain);
    if (result) {
      this.eventEmitter.emit('account.activate-or-block', {
        phoneNumber: userDomain.phoneNumber,
        id: userDomain.id,
      });
      this.eventEmitter.emit('account.archived', {
        phoneNumber: userDomain.phoneNumber,
        id: userDomain.id,
      });
      this.eventEmitter.emit('activity-logger.store', {
        modelId: command.id,
        modelName: MODELS.USER,
        action: ACTIONS.ARCHIVE,
        userId: command.currentUser.id,
        user: command.currentUser,
      });
    }
    return UserResponse.fromEntity(result);
  }
  async restoreUser(id: string, currentUser: UserInfo): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(id, [], true);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${id}`);
    }
    const r = await this.userRepository.restore(id);
    if (r) {
      this.eventEmitter.emit('account.activate-or-block', {
        phoneNumber: userDomain.phoneNumber,
        id: userDomain.id,
      });
      userDomain.deletedAt = null;
      this.eventEmitter.emit('account.restored', {
        phoneNumber: userDomain.phoneNumber,
        id: userDomain.id,
      });
      this.eventEmitter.emit('activity-logger.store', {
        modelId: id,
        modelName: MODELS.USER,
        action: ACTIONS.RESTORE,
        userId: currentUser.id,
        user: currentUser,
      });
    }
    return UserResponse.fromEntity(userDomain);
  }
  async deleteUser(id: string, currentUser: UserInfo): Promise<boolean> {
    const userDomain = await this.userRepository.getById(id, [], true);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${id}`);
    }
    const activity = await this.activityLoggerRepostory.getOneBy('userId', id);
    if (activity) {
      throw new NotFoundException(`User has history and can not be deeted`);
    }
    const result = await this.userRepository.delete(id);
    if (result) {
      if (userDomain.profileImage) {
        await this.fileManagerService.removeFile(
          userDomain.profileImage,
          FileManagerHelper.UPLOADED_FILES_DESTINATION,
        );
      }
      this.eventEmitter.emit('account.deleted', {
        phoneNumber: userDomain.phoneNumber,
        id: userDomain.id,
      });
      this.eventEmitter.emit('activity-logger.store', {
        modelId: id,
        modelName: MODELS.USER,
        action: ACTIONS.DELETE,
        userId: currentUser.id,
        user: currentUser,
      });
    }
    return result;
  }
  async activateOrBlockUser(
    id: string,
    currentUser: UserInfo,
  ): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(id);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${id}`);
    }
    userDomain.enabled = !userDomain.enabled;
    const result = await this.userRepository.update(id, userDomain);
    if (result) {
      this.eventEmitter.emit('account.activate-or-block', {
        phoneNumber: userDomain.phoneNumber,
        id: userDomain.id,
      });
      this.eventEmitter.emit('activity-logger.store', {
        modelId: id,
        modelName: MODELS.USER,
        action: userDomain.enabled ? ACTIONS.ACTIVATE : ACTIONS.BLOCK,
        userId: currentUser.id,
        user: currentUser,
      });
    }
    return UserResponse.fromEntity(result);
  }
  async updateUserProfileImage(id: string, fileDto: FileResponseDto) {
    const userDomain = await this.userRepository.getById(id, [], true);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${id}`);
    }
    if (userDomain.profileImage && fileDto) {
      await this.fileManagerService.removeFile(
        userDomain.profileImage,
        FileManagerHelper.UPLOADED_FILES_DESTINATION,
      );
    }
    userDomain.profileImage = fileDto as FileDto;
    const result = await this.userRepository.update(id, userDomain);
    if (result) {
      this.eventEmitter.emit('update-account-profile', {
        id: result.id,
        profileImage: result.profileImage,
      });
    }
    return UserResponse.fromEntity(result);
  }
}
