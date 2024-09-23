import { Account } from '@account/domains/accounts/account';
import { AccountPermission } from '@account/domains/accounts/account-permission';
import { Permission } from '@account/domains/permissions/permission';
import { AccountPermissionEntity } from '@account/persistence/accounts/account-permission.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponse } from '../permissions/permission.response';
import { RoleResponse } from '../roles/role.response';
import { AccountResponse } from './account.response';

export class AccountPermissionResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  accountId: string;
  @ApiProperty()
  permissionId: string;
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
  permission: PermissionResponse;
  role: RoleResponse;
  account: AccountResponse;
  static fromEntity(
    accountPermissionEntity: AccountPermissionEntity,
  ): AccountPermissionResponse {
    const accountPermissionResponse = new AccountPermissionResponse();
    accountPermissionResponse.id = accountPermissionEntity.id;
    accountPermissionResponse.accountId = accountPermissionEntity.accountId;
    accountPermissionResponse.permissionId =
      accountPermissionEntity.permissionId;
    accountPermissionResponse.roleId = accountPermissionEntity.roleId;
    accountPermissionResponse.archiveReason =
      accountPermissionEntity.archiveReason;
    accountPermissionResponse.createdBy = accountPermissionEntity.createdBy;
    accountPermissionResponse.updatedBy = accountPermissionEntity.updatedBy;
    accountPermissionResponse.deletedBy = accountPermissionEntity.deletedBy;
    accountPermissionResponse.createdAt = accountPermissionEntity.createdAt;
    accountPermissionResponse.updatedAt = accountPermissionEntity.updatedAt;
    accountPermissionResponse.deletedAt = accountPermissionEntity.deletedAt;
    if (accountPermissionEntity.permission) {
      accountPermissionResponse.permission = PermissionResponse.fromEntity(
        accountPermissionEntity.permission,
      );
    }
    if (accountPermissionEntity.role) {
      accountPermissionResponse.role = RoleResponse.fromEntity(
        accountPermissionEntity.role,
      );
    }
    if (accountPermissionEntity.account) {
      accountPermissionResponse.account = AccountResponse.fromEntity(
        accountPermissionEntity.account,
      );
    }
    return accountPermissionResponse;
  }
  static fromDomain(
    accountPermission: AccountPermission,
  ): AccountPermissionResponse {
    const accountPermissionResponse = new AccountPermissionResponse();
    accountPermissionResponse.id = accountPermission.id;
    accountPermissionResponse.accountId = accountPermission.accountId;
    accountPermissionResponse.permissionId = accountPermission.permissionId;
    accountPermissionResponse.roleId = accountPermission.roleId;
    accountPermissionResponse.archiveReason = accountPermission.archiveReason;
    accountPermissionResponse.createdBy = accountPermission.createdBy;
    accountPermissionResponse.updatedBy = accountPermission.updatedBy;
    accountPermissionResponse.deletedBy = accountPermission.deletedBy;
    accountPermissionResponse.createdAt = accountPermission.createdAt;
    accountPermissionResponse.updatedAt = accountPermission.updatedAt;
    accountPermissionResponse.deletedAt = accountPermission.deletedAt;
    if (accountPermission.permission) {
      accountPermissionResponse.permission = PermissionResponse.fromDomain(
        accountPermission.permission,
      );
    }
    if (accountPermission.role) {
      accountPermissionResponse.role = RoleResponse.fromDomain(
        accountPermission.role,
      );
    }
    if (accountPermission.account) {
      accountPermissionResponse.account = AccountResponse.fromDomain(
        accountPermission.account,
      );
    }
    return accountPermissionResponse;
  }
}
