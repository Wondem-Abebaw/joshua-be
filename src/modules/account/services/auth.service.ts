import { EventEmitter2 } from '@nestjs/event-emitter';
import { ForgotPasswordCommand, ResetPasswordCommand } from '../auth.commands';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ChangePasswordCommand,
  UpdatePasswordCommand,
  UserLoginCommand,
} from '@account/auth.commands';
import { AccountEntity } from '@account/persistence/accounts/account.entity';
import { Util } from '@libs/common/util';
import { UserInfo } from '@account/dtos/user-info.dto';
import { ResetPasswordTokenEntity } from '@account/persistence/reset-password/reset-password.entity';
import * as crypto from 'crypto';
import { AccountQuery } from '@account/usecases/accounts/account.usecase.queries';
import { CollectionQuery } from '@libs/collection-query/collection-query';
import { AccountResponse } from '@account/usecases/accounts/account.response';
import { RoleRepository } from '@account/persistence/roles/role.repository';
import { SessionCommands } from '@account/usecases/sessions/session.usecase.commands';
import { SendSmsCommand } from '@notification/usecases/notifications/notification.commands';
import { AppService } from 'app.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(ResetPasswordTokenEntity)
    private readonly resetPasswordTokenRepository: Repository<ResetPasswordTokenEntity>,
    private readonly eventEmitter: EventEmitter2,
    private readonly accountQuery: AccountQuery,
    private readonly roleRepository: RoleRepository,
    private readonly sessionCommand: SessionCommands,
    private appService: AppService,
  ) {}
  async login(loginCommand: UserLoginCommand) {
    let account = await this.accountRepository.findOneBy({
      phoneNumber: loginCommand.phoneNumber,
      type: loginCommand.type,
    });
    if (!account) {
      throw new BadRequestException(`Incorrect phone number or password`);
    }
    if (!Util.comparePassword(loginCommand.password, account.password)) {
      throw new BadRequestException(`Incorrect phone number or password`);
    }
    if (account.isActive === false || !account.isActive) {
      throw new BadRequestException(
        `You have been blocked, please contact us.`,
      );
    }
    if (loginCommand.fcmId) {
      account.fcmId = loginCommand.fcmId;
      account = await this.accountRepository.save(account);
    }
    const q = new CollectionQuery();
    const accountRoles = await this.accountQuery.getRoles(account.id, q);
    const defaultAccountRole =
      accountRoles && accountRoles[0] ? accountRoles[0] : null;
    const permissions = defaultAccountRole
      ? await this.accountQuery.getPermissionsByAccountIdAndRoleId(
          account.id,
          defaultAccountRole.id,
          q,
        )
      : [];
    const rolePayload = {
      id: '',
      name: '',
      key: '',
    };
    if (defaultAccountRole) {
      rolePayload.id = defaultAccountRole.id;
      rolePayload.name = defaultAccountRole.name;
      rolePayload.key = defaultAccountRole.key;
    }
    const permissionPayload = [];
    if (permissions.length > 0) {
      for (const permission of permissions) {
        permissionPayload.push(permission.key);
      }
    }
    const payload: UserInfo = {
      id: account.id,
      email: account?.email,
      name: account?.name,
      gender: account?.gender,
      type: account?.type,
      fcmId: account?.fcmId,
      profileImage: account?.profileImage,
      address: account?.address,
      phoneNumber: account?.phoneNumber,
      role: { ...rolePayload },
      permissions: permissionPayload,
    };
    const accessToken = Util.GenerateToken(payload, '60m');
    const refreshToken = Util.GenerateRefreshToken(payload, '365d');
    await this.sessionCommand.createSession({
      accountId: payload.id,
      token: accessToken,
      refreshToken,
    });
    return {
      accessToken,
      refreshToken,
      profile: {
        ...AccountResponse.fromEntity(account),
        roles: accountRoles,
        permissions,
        currentRole: { ...rolePayload },
      },
    };
  }
  async switchRole(roleId: string, currentUser: UserInfo) {
    const q = new CollectionQuery();
    const accountRole = await this.roleRepository.getById(roleId);
    const permissions = accountRole
      ? await this.accountQuery.getPermissionsByAccountIdAndRoleId(
          currentUser.id,
          roleId,
          q,
        )
      : [];
    const rolePayload = {
      id: '',
      name: '',
      key: '',
    };
    if (accountRole) {
      rolePayload.id = accountRole.id;
      rolePayload.name = accountRole.name;
      rolePayload.key = accountRole.key;
    }
    const permissionPayload = [];
    if (permissions.length > 0) {
      for (const permission of permissions) {
        permissionPayload.push(permission.key);
      }
    }
    currentUser.permissions = permissionPayload;
    currentUser.role = { ...rolePayload };
    return {
      accessToken: Util.GenerateToken(currentUser, '60m'),
      refreshToken: Util.GenerateRefreshToken(currentUser),
      permissions,
      currentRole: { ...rolePayload },
    };
  }
  async changePassword(changePasswordCommand: ChangePasswordCommand) {
    const currentUser = changePasswordCommand.currentUser;
    const user = await this.accountRepository.findOneBy({
      id: currentUser.id,
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (
      !Util.comparePassword(
        changePasswordCommand.currentPassword,
        user.password,
      )
    ) {
      throw new BadRequestException(`Incorrect old password`);
    }
    user.password = Util.hashPassword(changePasswordCommand.password);
    const result = await this.accountRepository.update(user.id, user);
    return result ? true : false;
  }
  async updatePassword(updatePasswordCommand: UpdatePasswordCommand) {
    const user = await this.accountRepository.findOneBy({
      username: `${updatePasswordCommand.type.toLowerCase()}_${
        updatePasswordCommand.phoneNumber
      }`,
    });
    if (!user) {
      throw new NotFoundException(
        `User account not found with this phone number`,
      );
    }
    user.password = Util.hashPassword(updatePasswordCommand.password);
    const result = await this.accountRepository.update(user.id, user);
    return result ? true : false;
  }
  // async forgotPassword(command: ForgotPasswordCommand) {
  //   const account = await this.accountRepository.findOneBy({
  //     email: command.email,
  //     type: command.type,
  //   });
  //   if (!account) {
  //     throw new BadRequestException(
  //       `User Account does not exist with email ${command.email}`,
  //     );
  //   }

  //   //delete the previous token
  //   await this.resetPasswordTokenRepository.delete({
  //     accountId: account.id,
  //   });
  //   const token = crypto.randomBytes(32).toString('hex');
  //   const resetPasswordTokenPayload = {
  //     accountId: account.id,
  //     email: command.email,
  //     type: command.type,
  //     token: Util.hashPassword(token),
  //   };
  //   const resetPasswordToken = await this.resetPasswordTokenRepository.save(
  //     resetPasswordTokenPayload,
  //   );

  //   if (!resetPasswordToken) {
  //     throw new BadRequestException('unknown error happen. Please try again');
  //   }
  //   const resetPasswordLink = `${process.env.WEBSITE_DOMAIN}/${process.env.RESET_PASSWORD_URL}?token=${token}&id=${account.id}`;
  //   const emailPayload = {
  //     name: account.name,
  //     email: command.email,
  //     url: resetPasswordLink,
  //   };
  //   this.eventEmitter.emit('reset-password', emailPayload);
  //   return true;
  // }
  async forgotPassword(command: ForgotPasswordCommand) {
    const account = await this.accountRepository.findOneBy({
      phoneNumber: command.phoneNumber,
      type: command.type,
    });
    if (!account) {
      throw new BadRequestException(
        `User Account does not exist with phone ${command.phoneNumber}`,
      );
    }
    const newPassword = Util.generatePassword(8);
    account.password = Util.hashPassword(newPassword);
    const result = await this.accountRepository.update(account.id, account);
    if (result) {
      const message = `Your new temporary password for Tutor is ${newPassword}. Please login and change your password.`;
      const commands = new SendSmsCommand();
      commands.message = message;
      commands.phone = command.phoneNumber;
      this.appService.sendSms(commands);
      return true;
    }
    return false;
  }
  async resetPassword(command: ResetPasswordCommand) {
    const resetPassword = await this.resetPasswordTokenRepository.findOneBy({
      accountId: command.id,
    });
    if (!resetPassword) {
      throw new BadRequestException(`Invalid or expired password reset token`);
    }
    if (!Util.comparePassword(command.token, resetPassword.token)) {
      throw new BadRequestException(`Invalid or expired password reset token`);
    }
    const tokenExpiredAt = resetPassword.createdAt.getTime() + 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    const d = currentTime - tokenExpiredAt;
    if (d >= 0) {
      throw new BadRequestException(`Invalid or expired password reset token`);
    }
    const account = await this.accountRepository.findOneBy({
      email: resetPassword.email,
    });
    if (!account) {
      throw new BadRequestException(`User Account does not exist`);
    }
    account.password = Util.hashPassword(command.password);
    const result = await this.accountRepository.update(account.id, account);
    if (result) {
      //delete the token
      await this.resetPasswordTokenRepository.delete({
        accountId: account.id,
      });
      return true;
    }
    return false;
  }
  async resetUserPassword(command: ForgotPasswordCommand): Promise<boolean> {
    const account = await this.accountRepository.findOneBy({
      phoneNumber: command.phoneNumber,
      type: command.type,
    });
    if (!account) {
      throw new BadRequestException(
        `User Account does not exist with phone ${command.phoneNumber}`,
      );
    }
    const newPassword = Util.generatePassword(8);
    account.password = Util.hashPassword(newPassword);
    const result = await this.accountRepository.update(account.id, account);
    if (result) {
      const message = `Your new temporary password for Tutor is ${newPassword}\n Please login and change your password.`;
      const commands = new SendSmsCommand();
      commands.message = message;
      commands.phone = command.phoneNumber;
      this.appService.sendSms(commands);
      return true;
    }
    return false;
  }
}
