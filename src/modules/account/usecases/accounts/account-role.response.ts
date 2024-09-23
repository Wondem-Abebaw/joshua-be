import { AccountRole } from '@account/domains/accounts/account-role';
import { AccountRoleEntity } from '@account/persistence/accounts/account-role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RoleResponse } from '../roles/role.response';
import { AccountResponse } from './account.response';

export class AccountRoleResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  accountId: string;
  @ApiProperty()
  roleId: string;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  deletedBy?: string;
  @ApiProperty()
  archiveReason: string;
  role: RoleResponse;
  account: AccountResponse;
  static fromEntity(accountRoleEntity: AccountRoleEntity): AccountRoleResponse {
    const accountRoleResponse = new AccountRoleResponse();
    accountRoleResponse.id = accountRoleEntity.id;
    accountRoleResponse.accountId = accountRoleEntity.accountId;
    accountRoleResponse.roleId = accountRoleEntity.roleId;
    accountRoleResponse.archiveReason = accountRoleEntity.archiveReason;
    accountRoleResponse.createdBy = accountRoleEntity.createdBy;
    accountRoleResponse.updatedBy = accountRoleEntity.updatedBy;
    accountRoleResponse.deletedBy = accountRoleEntity.deletedBy;
    accountRoleResponse.createdAt = accountRoleEntity.createdAt;
    accountRoleResponse.updatedAt = accountRoleEntity.updatedAt;
    accountRoleResponse.deletedAt = accountRoleEntity.deletedAt;
    if (accountRoleEntity.role) {
      accountRoleResponse.role = RoleResponse.fromEntity(
        accountRoleEntity.role,
      );
    }
    if (accountRoleEntity.account) {
      accountRoleResponse.account = AccountResponse.fromEntity(
        accountRoleEntity.account,
      );
    }
    return accountRoleResponse;
  }
  static fromDomain(accountRole: AccountRole): AccountRoleResponse {
    const accountRoleResponse = new AccountRoleResponse();
    accountRoleResponse.id = accountRole.id;
    accountRoleResponse.accountId = accountRole.accountId;
    accountRoleResponse.roleId = accountRole.roleId;
    accountRoleResponse.archiveReason = accountRole.archiveReason;
    accountRoleResponse.createdBy = accountRole.createdBy;
    accountRoleResponse.updatedBy = accountRole.updatedBy;
    accountRoleResponse.deletedBy = accountRole.deletedBy;
    accountRoleResponse.createdAt = accountRole.createdAt;
    accountRoleResponse.updatedAt = accountRole.updatedAt;
    accountRoleResponse.deletedAt = accountRole.deletedAt;
    if (accountRole.role) {
      accountRoleResponse.role = RoleResponse.fromDomain(accountRole.role);
    }
    if (accountRole.account) {
      accountRoleResponse.account = AccountResponse.fromDomain(
        accountRole.account,
      );
    }
    return accountRoleResponse;
  }
}
