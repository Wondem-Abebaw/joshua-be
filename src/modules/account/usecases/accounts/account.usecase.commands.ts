import { ClientProxy } from '@nestjs/microservices';
import {
  CreateAccountCommand,
  UpdateAccountCommand,
  UpgradePlanCommands,
} from './account.commands';
import { AccountRepository } from '@account/persistence/accounts/account.repository';
import { AccountResponse } from './account.response';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ArchiveAccountRoleCommand,
  CreateAccountRoleCommand,
  CreateAccountRolesCommand,
  DeleteAccountRoleCommand,
  UpdateAccountRoleCommand,
} from './account-role.commands';
import { AccountRoleResponse } from './account-role.response';
import { AccountRoleEntity } from '@account/persistence/accounts/account-role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountPermissionEntity } from '@account/persistence/accounts/account-permission.entity';
import { AccountPermissionResponse } from './account-permission.response';
import {
  AddAccountPermissionsCommand,
  ArchiveAccountPermissionCommand,
  CreateAccountPermissionCommand,
  DeleteAccountPermissionCommand,
  UpdateAccountPermissionCommand,
} from './account-permission.commands';
import { RoleQueries } from '../roles/role.usecase.queries';
import { CollectionQuery } from '@libs/collection-query/collection-query';
import { FilterOperators } from '@libs/collection-query/filter_operators';
import { RoleResponse } from '../roles/role.response';
import { PermissionResponse } from '../permissions/permission.response';
import { PermissionQueries } from '../permissions/permission.usecase.queries';
import { CredentialType, JobPostType } from '@libs/common/enums';
import { RoleRepository } from '@account/persistence/roles/role.repository';
import { Role } from '@account/domains/roles/role';
import { v4 as uuidv4 } from 'uuid';
import { Util } from '@libs/common/util';
import { SendSmsCommand } from '@notification/usecases/notifications/notification.commands';
import { AppService } from 'app.service';
@Injectable()
export class AccountCommands {
  constructor(
    private accountRepository: AccountRepository,
    @InjectRepository(AccountRoleEntity)
    private accountRoleRepository: Repository<AccountRoleEntity>,
    @InjectRepository(AccountPermissionEntity)
    private accountPermissionRepository: Repository<AccountPermissionEntity>,
    @Inject('EMAIL_CREDENTIAL_SERVICE')
    private emailServiceClient: ClientProxy,
    private roleQueries: RoleQueries,
    private roleRepository: RoleRepository,
    private permissionQueries: PermissionQueries,
    private appService: AppService,
  ) {}
  async createAccount(command: CreateAccountCommand): Promise<AccountResponse> {
    const accountDomain = CreateAccountCommand.fromCommand(command);
    const existingAccount = await this.accountRepository.getByUsername(
      accountDomain.username,
      true,
    );
    if (!existingAccount) {
      const account = await this.accountRepository.insert(accountDomain);
      if (account.type !== CredentialType.Employee) {
        let role = await this.roleRepository.getByKey(account.type);
        if (!role) {
          const roleName = `${account.type[0].toUpperCase()}${account.type.slice(
            1,
            account.type.length,
          )}`;
          role = await this.roleRepository.insert({
            name: roleName,
            key: account.type,
            protected: true,
          } as Role);
        }
        const accountRoleCommand: CreateAccountRolesCommand = {
          accountId: account.id,
          roles: [role.id],
        };
        await this.seedAccountRole(accountRoleCommand);
      }
      return AccountResponse.fromDomain(account);
    }
    return AccountResponse.fromDomain(accountDomain);
  }
  @OnEvent('update.account')
  async updateAccount(command: UpdateAccountCommand): Promise<AccountResponse> {
    const accountDomain = await this.accountRepository.getByAccountId(
      command.accountId,
    );
    if (accountDomain) {
      accountDomain.name = command.name;
      accountDomain.email = command.email;
      accountDomain.phoneNumber = command.phoneNumber;
      accountDomain.gender = command.gender;
      accountDomain.address = command.address;
      accountDomain.planTypeId = command.planTypeId;
      accountDomain.planTypeDuration = command.planTypeDuration;
      // accountDomain.numberOfJobPosts = command.numberOfJobPosts;
      accountDomain.verified = command.verified;
      accountDomain.notifyMe = command.notifyMe;
      accountDomain.profileImage = command.profileImage
        ? command.profileImage
        : accountDomain.profileImage;
      accountDomain.isActive = command.isActive
        ? command.isActive
        : accountDomain.isActive;
      const account = await this.accountRepository.update(accountDomain);
      return AccountResponse.fromDomain(account);
    }
    return null;
  }
  async archiveAccount(id: string): Promise<boolean> {
    const accountDomain = await this.accountRepository.getById(id);
    if (!accountDomain) {
      throw new NotFoundException(`Account not found with id ${id}`);
    }
    return await this.accountRepository.archive(id);
  }
  async restoreAccount(id: string): Promise<AccountResponse> {
    const accountDomain = await this.accountRepository.getById(id, true);
    if (!accountDomain) {
      throw new NotFoundException(`Account not found with id ${id}`);
    }
    const r = await this.accountRepository.restore(id);
    if (r) {
      accountDomain.deletedAt = null;
    }
    return AccountResponse.fromDomain(accountDomain);
  }
  async deleteAccount(id: string): Promise<boolean> {
    const accountDomain = await this.accountRepository.getById(id);
    if (!accountDomain) {
      throw new NotFoundException(`Account not found with id ${id}`);
    }
    return await this.accountRepository.delete(id);
  }
  @OnEvent('change.payment.status')
  async upgradePlan(commands: UpgradePlanCommands): Promise<AccountResponse> {
    const customerDomain = await this.accountRepository.getById(commands.id);
    if (!customerDomain) {
      throw new NotFoundException(`Account not found with id ${commands.id}`);
    }
    customerDomain.isPaid = true;
    // customerDomain.planTypeId = commands.planTypeId;
    customerDomain.planTypeDuration = commands.planTypeDuration;
    // if (customerDomain.type === CredentialType.Employer) {
    //   customerDomain.numberOfJobPosts = commands.numberOfJobPosts;
    // }
    const result = await this.accountRepository.update(customerDomain);
    return AccountResponse.fromDomain(result);
  }
  // @OnEvent('update.job-post-numbers')
  // async updateJobPostNumbers(
  //   id: string,
  //   // commands: UpgradePlanCommands,
  // ): Promise<AccountResponse> {
  //   const customerDomain = await this.accountRepository.getById(id);
  //   if (!customerDomain) {
  //     throw new NotFoundException(`Account not found with id ${id}`);
  //   }
  //   customerDomain.numberOfJobPosts -= 1;
  //   const result = await this.accountRepository.update(customerDomain);
  //   return AccountResponse.fromDomain(result);
  // }
  // @OnEvent('update.request-numbers')
  // async updateRequestNumbers(
  //   id: string,
  //   // commands: UpgradePlanCommands,
  // ): Promise<AccountResponse> {
  //   const customerDomain = await this.accountRepository.getById(id);
  //   if (!customerDomain) {
  //     throw new NotFoundException(`Account not found with id ${id}`);
  //   }
  //   customerDomain.numberOfRequests -= 1;
  //   const result = await this.accountRepository.update(customerDomain);
  //   return AccountResponse.fromDomain(result);
  // }
  @OnEvent('account.deleted')
  async handleDeleteAccount(command: { phoneNumber: string; id: string }) {
    const existingAccount = await this.accountRepository.getById(
      command.id,
      true,
    );
    if (existingAccount) {
      await this.accountRepository.delete(existingAccount.id);
    }
  }
  @OnEvent('change.online.status')
  async changeOnlineStatus(command: { isOnline: boolean; id: string }) {
    console.log(
      '🚀 ~ AccountCommands ~ changeOnlineStatus ~ command:',
      command,
    );
    const customer = await this.accountRepository.getById(command.id, true);
    if (customer) {
      customer.isOnline = command.isOnline;
      const status = await this.accountRepository.update(customer);
    }
  }
  @OnEvent('account.archived')
  async handleArchiveAccount(command: { phoneNumber: string; id: string }) {
    const account = await this.accountRepository.getById(command.id, true);
    if (account) {
      account.deletedAt = new Date();
      await this.accountRepository.update(account);
    }
  }
  @OnEvent('account.restored')
  async handleRestoreAccount(command: { phoneNumber: string; id: string }) {
    const account = await this.accountRepository.getById(command.id, true);
    if (account) {
      account.deletedAt = null;
      account.deletedBy = null;
      await this.accountRepository.update(account);
    }
  }
  @OnEvent('verify.account')
  async handleVerifyAccount(phone: string, type: string) {
    const account = await this.accountRepository.getByPhoneNumberAndType(
      phone,
      type,
      true,
    );
    if (account) {
      account.verified = true;
      await this.accountRepository.update(account);
    }
  }
  @OnEvent('account.activate-or-block')
  async activateOrBlockAccount(command: { phoneNumber: string; id: string }) {
    const account = await this.accountRepository.getById(command.id, true);
    if (account) {
      account.isActive = !account.isActive;
      // console.log(account.isActive);
      const status = await this.accountRepository.update(account);
    }
  }
  @OnEvent('account.create-super-admin')
  async createDefaultSupperAdminAccount(data: any) {
    try {
      const command: CreateAccountCommand = {
        accountId: uuidv4(),
        email: 'wondem5060@gmail.com',
        type: CredentialType.Employee,
        name: 'Super Admin',
        isActive: true,
        password: Util.hashPassword('P@ssw0rd'),
        phoneNumber: '+251948261915',
        gender: 'female',
        verified: true,
        notifyMe: false,
        isPaid: false,
      };
      const accountDomain = CreateAccountCommand.fromCommand(command);
      const superAccount = await this.accountRepository.insert(accountDomain);
      const accountRoleCommand: CreateAccountRolesCommand = {
        accountId: superAccount.id,
        roles: [data.roleId],
      };
      await this.seedAccountRole(accountRoleCommand);
    } catch (error) {
      // console.log(error.message);
    }
  }
  // @OnEvent('send.email.credential')
  // sendEmailCredential(command: {
  //   name: string;
  //   email: string;
  //   phoneNumber: string;
  //   password: string;
  // }) {
  //   this.emailServiceClient.emit('send-email-credential', command);
  // }
  @OnEvent('send.email.credential')
  sendEmailCredential(command: {
    name: string;
    email?: string;
    phoneNumber: string;
    password: string;
  }) {
    const message = `Your Credentials for Seed are:\nPhone: ${command.phoneNumber}\nPassword: ${command.password}\nYour password is auto generated so please log in and change it.`;
    const commands = new SendSmsCommand();
    commands.message = message;
    commands.phone = command.phoneNumber;
    this.appService.sendSms(commands);
  }
  @OnEvent('reset-password')
  sendResetPasswordEmailLink(command: {
    name: string;
    email: string;
    url: string;
  }) {
    this.emailServiceClient.emit('reset-password', command);
  }
  async addAccountRole(
    command: CreateAccountRolesCommand,
  ): Promise<RoleResponse[]> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
    );
    if (!accountDomain) {
      throw new NotFoundException(
        ` Account does not found with id ${command.accountId}`,
      );
    }
    accountDomain.accountRoles = [];
    for (const roleId of command.roles) {
      const accountRole = CreateAccountRoleCommand.fromCommand({
        roleId: roleId,
        accountId: command.accountId,
      });
      accountDomain.addAccountRole(accountRole);
    }
    const result = await this.accountRepository.update(accountDomain);
    if (!result) return null;
    if (result.accountRoles.length === 0) return [];
    const roleIds = result.accountRoles.map((role) => role.roleId);

    const query = new CollectionQuery();
    query.filter = [
      [
        {
          field: 'id',
          operator: FilterOperators.In,
          value: roleIds.join(','),
        },
      ],
    ];
    const permissionResponseData = await this.roleQueries.getRoles(query);
    return permissionResponseData.data;
  }
  async seedAccountRole(
    command: CreateAccountRolesCommand,
  ): Promise<AccountResponse> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
    );
    if (accountDomain) {
      accountDomain.accountRoles = [];
      for (const roleId of command.roles) {
        const accountRole = CreateAccountRoleCommand.fromCommand({
          roleId: roleId,
          accountId: command.accountId,
        });
        accountDomain.addAccountRole(accountRole);
      }
      const result = await this.accountRepository.update(accountDomain);
      return AccountResponse.fromDomain(result);
    }
    return null;
  }
  async updateAccountRole(
    command: UpdateAccountRoleCommand,
  ): Promise<AccountRoleResponse> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
    );
    if (!accountDomain) {
      throw new NotFoundException(
        `Account does not found with id ${command.accountId}`,
      );
    }
    const oldPayload = accountDomain.accountRoles.find(
      (b) => b.id === command.id,
    );
    if (oldPayload) {
      throw new BadRequestException(`Role already assigned to this account`);
    }

    const accountRole = UpdateAccountRoleCommand.fromCommand(command);
    accountDomain.updateAccountRole(accountRole);
    const result = await this.accountRepository.update(accountDomain);
    if (!result) return null;

    const response = AccountRoleResponse.fromDomain(
      result.accountRoles.find((accountRole) => accountRole.id === command.id),
    );
    return response;
  }
  async deleteAccountRole(command: DeleteAccountRoleCommand): Promise<boolean> {
    const accountRole = await this.accountRoleRepository.findOne({
      where: { roleId: command.roleId, accountId: command.accountId },
      withDeleted: true,
    });
    if (!accountRole) {
      throw new NotFoundException(`Account role not found`);
    }
    const result = await this.accountRoleRepository.delete({
      id: accountRole.id,
    });
    return result ? true : false;
  }
  async archiveAccountRole(
    command: ArchiveAccountRoleCommand,
  ): Promise<boolean> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
    );
    if (!accountDomain) {
      throw new NotFoundException(
        `Account does not found with id ${command.accountId}`,
      );
    }
    const accountRole = accountDomain.accountRoles.find(
      (accountRole) => accountRole.id === command.id,
    );
    accountRole.deletedAt = new Date();
    accountRole.deletedBy = command.currentUser.id;
    accountRole.archiveReason = command.reason;
    accountDomain.updateAccountRole(accountRole);
    const result = await this.accountRepository.update(accountDomain);

    return result ? true : false;
  }
  async restoreAccountRole(
    command: DeleteAccountRoleCommand,
  ): Promise<AccountRoleResponse> {
    const accountRole = await this.accountRoleRepository.findOne({
      where: { roleId: command.roleId, accountId: command.accountId },
      withDeleted: true,
    });
    if (!accountRole) {
      throw new NotFoundException(`Account role not found`);
    }
    accountRole.deletedAt = null;
    const result = await this.accountRoleRepository.save(accountRole);
    return AccountRoleResponse.fromEntity(result);
  }

  //Account Permission
  async addAccountPermission(
    command: AddAccountPermissionsCommand,
  ): Promise<PermissionResponse[]> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
    );
    if (!accountDomain) {
      throw new NotFoundException(
        ` Account does not found with id ${command.accountId}`,
      );
    }
    const currentNumberOfPermissions = Array.isArray(
      accountDomain.accountPermissions,
    )
      ? accountDomain.accountPermissions.length
      : 0;
    for (const permissionId of command.permissions) {
      const isExist = accountDomain.accountPermissions.find(
        (accountPermission) =>
          accountPermission.permissionId === permissionId &&
          accountPermission.roleId === command.roleId,
      );
      if (!isExist) {
        const accountPermission = CreateAccountPermissionCommand.fromCommand({
          permissionId: permissionId,
          accountId: command.accountId,
          roleId: command.roleId,
        });
        accountDomain.addAccountPermission(accountPermission);
      }
    }
    const result = await this.accountRepository.update(accountDomain);
    if (!result) return null;

    if (result.accountPermissions.length === 0) return [];
    const newAccountPermissions = accountDomain.accountPermissions.splice(
      currentNumberOfPermissions,
      accountDomain.accountPermissions.length,
    );
    const permissionIds = newAccountPermissions.map(
      (permission) => permission.permissionId,
    );
    const query = new CollectionQuery();
    if (permissionIds.length > 0) {
      query.filter = [
        [
          {
            field: 'id',
            operator: FilterOperators.In,
            value: permissionIds.join(','),
          },
        ],
      ];
    }
    const permissionResponseData = await this.permissionQueries.getPermissions(
      query,
    );
    return permissionResponseData.data;
  }
  async updateAccountPermission(
    command: UpdateAccountPermissionCommand,
  ): Promise<AccountPermissionResponse> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
    );
    if (!accountDomain) {
      throw new NotFoundException(
        `Account does not found with id ${command.accountId}`,
      );
    }
    const oldPayload = accountDomain.accountPermissions.find(
      (b) => b.id === command.id,
    );
    if (oldPayload) {
      throw new BadRequestException(
        `Permission already assigned to this account`,
      );
    }

    const accountPermission =
      UpdateAccountPermissionCommand.fromCommand(command);
    accountDomain.updateAccountPermission(accountPermission);
    const result = await this.accountRepository.update(accountDomain);
    if (!result) return null;

    const response = AccountPermissionResponse.fromDomain(
      result.accountPermissions.find(
        (accountPermission) => accountPermission.id === command.id,
      ),
    );
    return response;
  }
  async deleteAccountPermission(
    command: DeleteAccountPermissionCommand,
  ): Promise<boolean> {
    const accountPermission = await this.accountPermissionRepository.find({
      where: { id: command.id },
      withDeleted: true,
    });
    if (!accountPermission[0]) {
      throw new NotFoundException(
        `Account permission not found with id ${command.id}`,
      );
    }
    const result = await this.accountPermissionRepository.delete({
      id: command.id,
    });
    return result ? true : false;
  }
  async archiveAccountPermission(
    command: ArchiveAccountPermissionCommand,
  ): Promise<boolean> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
    );
    if (!accountDomain) {
      throw new NotFoundException(
        ` Account does not found with id ${command.accountId}`,
      );
    }
    const accountPermission = accountDomain.accountPermissions.find(
      (accountPermission) => accountPermission.id === command.id,
    );
    accountPermission.deletedAt = new Date();
    accountPermission.deletedBy = command.currentUser.id;
    accountPermission.archiveReason = command.reason;
    accountDomain.updateAccountPermission(accountPermission);
    const result = await this.accountRepository.update(accountDomain);
    return result ? true : false;
  }
  async restoreAccountPermission(
    command: DeleteAccountPermissionCommand,
  ): Promise<AccountPermissionResponse> {
    const accountPermission = await this.accountPermissionRepository.find({
      where: { id: command.id },
      withDeleted: true,
    });
    if (!accountPermission[0]) {
      throw new NotFoundException(
        `Account permission not found with id ${command.id}`,
      );
    }
    accountPermission[0].deletedAt = null;
    const result = await this.accountPermissionRepository.save(
      accountPermission[0],
    );
    return AccountPermissionResponse.fromEntity(result);
  }
  @OnEvent('update-account-profile')
  async updateAccountProfile(profileInfo): Promise<void> {
    const accountDomain = await this.accountRepository.getByAccountId(
      profileInfo.id,
    );
    if (accountDomain) {
      accountDomain.profileImage = profileInfo.profileImage;
      await this.accountRepository.update(accountDomain);
    }
  }
}
