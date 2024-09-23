import { AccountEntity } from '@account/persistence/accounts/account.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@account/domains/accounts/account';
import { IAccountRepository } from '@account/domains/accounts/account.repository.interface';
import { Repository } from 'typeorm';
import { AccountRoleEntity } from './account-role.entity';
import { AccountRole } from '@account/domains/accounts/account-role';
import { AccountPermission } from '@account/domains/accounts/account-permission';
import { AccountPermissionEntity } from './account-permission.entity';
import { CredentialType } from '@libs/common/enums';
@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
  ) {}
  async insert(account: Account): Promise<Account> {
    const accountEntity = this.toAccountEntity(account);
    const result = await this.accountRepository.save(accountEntity);
    return result ? this.toAccount(result) : null;
  }
  async update(account: Account): Promise<Account> {
    const accountEntity = this.toAccountEntity(account);
    const result = await this.accountRepository.save(accountEntity);
    return result ? this.toAccount(result) : null;
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.accountRepository.delete({ id: id });
    if (result.affected > 0) return true;
    return false;
  }
  async getAll(withDeleted: boolean): Promise<Account[]> {
    const accounts = await this.accountRepository.find({
      relations: [],
      withDeleted: withDeleted,
    });
    if (!accounts.length) {
      return null;
    }
    return accounts.map((account) => this.toAccount(account));
  }
  async getAllForNotification(
    type: string,
    withDeleted: boolean,
  ): Promise<Account[]> {
    if (type === 'all') {
      const accounts = await this.accountRepository.find({
        where: [
          { type: CredentialType.Tutor },
          { type: CredentialType.Employer },
          { type: CredentialType.Agent },
        ],
        relations: [],
        withDeleted: withDeleted,
      });
      if (!accounts.length) {
        return null;
      }
      return accounts.map((account) => this.toAccount(account));
    } else {
      const accounts = await this.accountRepository.find({
        where: { type: type },
        relations: [],
        withDeleted: withDeleted,
      });
      if (!accounts.length) {
        return null;
      }
      return accounts.map((account) => this.toAccount(account));
    }
  }
  async getAllCountForNotification(
    type: string,
    withDeleted: boolean,
  ): Promise<number> {
    if (type === 'all') {
      const count = await this.accountRepository.count({
        where: [
          { type: CredentialType.Tutor },
          { type: CredentialType.Employer },
          { type: CredentialType.Agent },
        ],
        relations: [],
        withDeleted: withDeleted,
      });
      return count;
    } else {
      const count = await this.accountRepository.count({
        where: { type: type },
        relations: [],
        withDeleted: withDeleted,
      });
      return count;
    }
  }
  async getThousandForNotification(
    type: string,
    withDeleted: boolean,
    skip: number = 0,
    take: number = 1,
  ): Promise<Account[]> {
    // console.log('skip', skip);
    // console.log('offset', take);
    // console.log('totalAccounts', totalAccounts);
    if (type === 'all') {
      const accounts = await this.accountRepository.find({
        where: [
          { type: CredentialType.Tutor },
          { type: CredentialType.Employer },
          { type: CredentialType.Agent },
        ],
        relations: [],
        withDeleted: withDeleted,
        skip,
        take,
      });
      if (!accounts.length) {
        return null;
      }
      return accounts.map((account) => this.toAccount(account));
    } else {
      const accounts = await this.accountRepository.find({
        where: { type: type },
        relations: [],
        withDeleted: withDeleted,
        skip,
        take,
      });
      if (!accounts.length) {
        return null;
      }
      return accounts.map((account) => this.toAccount(account));
    }
  }
  async getById(id: string, withDeleted = false): Promise<Account> {
    const account = await this.accountRepository.find({
      where: { id: id },
      relations: ['accountRoles', 'accountPermissions'],
      withDeleted: withDeleted,
    });
    if (!account[0]) {
      return null;
    }
    return this.toAccount(account[0]);
  }
  async getSuperAdmin(): Promise<Account> {
    const account = await this.accountRepository.find({
      where: { name: 'Super Admin' },
    });
    if (!account[0]) {
      return null;
    }
    return this.toAccount(account[0]);
  }
  async getByPhoneNumber(
    phoneNumber: string,
    withDeleted = false,
  ): Promise<Account> {
    const account = await this.accountRepository.find({
      where: { phoneNumber: phoneNumber },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!account[0]) {
      return null;
    }
    return this.toAccount(account[0]);
  }
  async getByPhoneNumberAndType(
    phoneNumber: string,
    type: string,
    withDeleted = false,
  ): Promise<Account> {
    const account = await this.accountRepository.find({
      where: { phoneNumber: phoneNumber, type: type },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!account[0]) {
      return null;
    }
    return this.toAccount(account[0]);
  }
  async checkByPhoneNumber(
    phoneNumber: string,
    type: string,
    withDeleted = false,
  ): Promise<Account> {
    const account = await this.accountRepository.find({
      where: { phoneNumber: phoneNumber, type: type },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!account[0]) {
      return null;
    }
    return this.toAccount(account[0]);
  }
  async checkByEmail(
    email: string,
    type: string,
    withDeleted = false,
  ): Promise<Account> {
    const account = await this.accountRepository.find({
      where: { email: email, type: type },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!account[0]) {
      return null;
    }
    return this.toAccount(account[0]);
  }
  async getByUsername(username: string, withDeleted = false): Promise<Account> {
    const account = await this.accountRepository.find({
      where: { username: username },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!account[0]) {
      return null;
    }
    return this.toAccount(account[0]);
  }
  async getByAccountId(
    accountId: string,
    withDeleted = false,
  ): Promise<Account> {
    const account = await this.accountRepository.find({
      where: { id: accountId },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!account[0]) {
      return null;
    }
    return this.toAccount(account[0]);
  }
  async archive(id: string): Promise<boolean> {
    const result = await this.accountRepository.softDelete(id);
    if (result.affected > 0) return true;
    return false;
  }
  async restore(id: string): Promise<boolean> {
    const result = await this.accountRepository.restore(id);
    if (result.affected > 0) return true;
    return false;
  }
  toAccount(accountEntity: AccountEntity): Account {
    const account = new Account();
    account.id = accountEntity.id;
    account.name = accountEntity.name;
    account.email = accountEntity.email;
    account.phoneNumber = accountEntity.phoneNumber;
    account.password = accountEntity.password;
    account.isActive = accountEntity.isActive;
    account.type = accountEntity.type;
    account.gender = accountEntity.gender;
    account.fcmId = accountEntity.fcmId;
    account.username = accountEntity.username;
    account.profileImage = accountEntity.profileImage;
    account.address = accountEntity.address;
    account.planTypeId = accountEntity.planTypeId;
    account.planTypeDuration = accountEntity.planTypeDuration;
    // account.numberOfJobPosts = accountEntity.numberOfJobPosts;
    // account.numberOfRequests = accountEntity.numberOfRequests;
    account.verified = accountEntity.verified;
    account.notifyMe = accountEntity.notifyMe;
    account.isPaid = accountEntity.isPaid;
    account.isOnline = accountEntity.isOnline;
    account.createdBy = accountEntity.createdBy;
    account.updatedBy = accountEntity.updatedBy;
    account.deletedBy = accountEntity.deletedBy;
    account.createdAt = accountEntity.createdAt;
    account.updatedAt = accountEntity.updatedAt;
    account.deletedAt = accountEntity.deletedAt;
    account.accountRoles = accountEntity.accountRoles
      ? accountEntity.accountRoles.map((accountRole) =>
          this.toAccountRole(accountRole),
        )
      : [];
    account.accountPermissions = accountEntity.accountPermissions
      ? accountEntity.accountPermissions.map((accountPermission) =>
          this.toAccountPermission(accountPermission),
        )
      : [];
    return account;
  }
  toAccountEntity(account: Account): AccountEntity {
    const accountEntity = new AccountEntity();
    accountEntity.id = account.id;
    accountEntity.name = account.name;
    accountEntity.email = account.email;
    accountEntity.phoneNumber = account.phoneNumber;
    accountEntity.password = account.password;
    accountEntity.isActive = account.isActive;
    accountEntity.type = account.type;
    accountEntity.gender = account.gender;
    accountEntity.fcmId = account.fcmId;
    accountEntity.username = account.username;
    accountEntity.profileImage = account.profileImage;
    accountEntity.address = account.address;
    accountEntity.planTypeId = account.planTypeId;
    accountEntity.planTypeDuration = account.planTypeDuration;
    // accountEntity.numberOfJobPosts = account.numberOfJobPosts;
    // accountEntity.numberOfRequests = account.numberOfRequests;
    accountEntity.verified = account.verified;
    accountEntity.notifyMe = account.notifyMe;
    accountEntity.isPaid = account.isPaid;
    accountEntity.isOnline = account.isOnline;
    accountEntity.createdBy = account.createdBy;
    accountEntity.updatedBy = account.updatedBy;
    accountEntity.deletedBy = account.deletedBy;
    accountEntity.createdAt = account.createdAt;
    accountEntity.updatedAt = account.updatedAt;
    accountEntity.deletedAt = account.deletedAt;
    accountEntity.accountRoles = account.accountRoles
      ? account.accountRoles.map((accountRole) =>
          this.toAccountRoleEntity(accountRole),
        )
      : [];
    accountEntity.accountPermissions = account.accountPermissions
      ? account.accountPermissions.map((accountPermission) =>
          this.toAccountPermissionEntity(accountPermission),
        )
      : [];
    return accountEntity;
  }

  toAccountRole(accountRoleEntity: AccountRoleEntity): AccountRole {
    const accountRole = new AccountRole();
    accountRole.id = accountRoleEntity.id;
    accountRole.accountId = accountRoleEntity.accountId;
    accountRole.roleId = accountRoleEntity.roleId;
    accountRole.archiveReason = accountRoleEntity.archiveReason;
    accountRole.createdBy = accountRoleEntity.createdBy;
    accountRole.updatedBy = accountRoleEntity.updatedBy;
    accountRole.deletedBy = accountRoleEntity.deletedBy;
    accountRole.createdAt = accountRoleEntity.createdAt;
    accountRole.updatedAt = accountRoleEntity.updatedAt;
    accountRole.deletedAt = accountRoleEntity.deletedAt;
    return accountRole;
  }
  toAccountRoleEntity(accountRole: AccountRole): AccountRoleEntity {
    const accountRoleEntity = new AccountRoleEntity();
    accountRoleEntity.id = accountRole.id;
    accountRoleEntity.accountId = accountRole.accountId;
    accountRoleEntity.roleId = accountRole.roleId;
    accountRoleEntity.archiveReason = accountRole.archiveReason;
    accountRoleEntity.createdBy = accountRole.createdBy;
    accountRoleEntity.updatedBy = accountRole.updatedBy;
    accountRoleEntity.deletedBy = accountRole.deletedBy;
    accountRoleEntity.createdAt = accountRole.createdAt;
    accountRoleEntity.updatedAt = accountRole.updatedAt;
    accountRoleEntity.deletedAt = accountRole.deletedAt;
    return accountRoleEntity;
  }
  toAccountPermission(
    accountPermissionEntity: AccountPermissionEntity,
  ): AccountPermission {
    const accountPermission = new AccountPermission();
    accountPermission.id = accountPermissionEntity.id;
    accountPermission.accountId = accountPermissionEntity.accountId;
    accountPermission.roleId = accountPermissionEntity.roleId;
    accountPermission.permissionId = accountPermissionEntity.permissionId;
    accountPermission.archiveReason = accountPermissionEntity.archiveReason;
    accountPermission.createdBy = accountPermissionEntity.createdBy;
    accountPermission.updatedBy = accountPermissionEntity.updatedBy;
    accountPermission.deletedBy = accountPermissionEntity.deletedBy;
    accountPermission.createdAt = accountPermissionEntity.createdAt;
    accountPermission.updatedAt = accountPermissionEntity.updatedAt;
    accountPermission.deletedAt = accountPermissionEntity.deletedAt;
    return accountPermission;
  }
  toAccountPermissionEntity(
    accountPermission: AccountPermission,
  ): AccountPermissionEntity {
    const accountPermissionEntity = new AccountPermissionEntity();
    accountPermissionEntity.id = accountPermission.id;
    accountPermissionEntity.accountId = accountPermission.accountId;
    accountPermissionEntity.roleId = accountPermission.roleId;
    accountPermissionEntity.permissionId = accountPermission.permissionId;
    accountPermissionEntity.archiveReason = accountPermission.archiveReason;
    accountPermissionEntity.createdBy = accountPermission.createdBy;
    accountPermissionEntity.updatedBy = accountPermission.updatedBy;
    accountPermissionEntity.deletedBy = accountPermission.deletedBy;
    accountPermissionEntity.createdAt = accountPermission.createdAt;
    accountPermissionEntity.updatedAt = accountPermission.updatedAt;
    accountPermissionEntity.deletedAt = accountPermission.deletedAt;
    return accountPermissionEntity;
  }
}
