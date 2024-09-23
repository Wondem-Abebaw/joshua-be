import { AccountPermission } from '@account/domains/accounts/account-permission';
import { UserInfo } from '@account/dtos/user-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AddAccountPermissionsCommand {
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  permissions: string[];
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  currentUser: UserInfo;
}
export class CreateAccountPermissionCommand {
  accountId: string;
  permissionId: string;
  roleId: string;
  static fromCommand(
    createAccountPermission: CreateAccountPermissionCommand,
  ): AccountPermission {
    const accountPermission = new AccountPermission();
    accountPermission.accountId = createAccountPermission.accountId;
    accountPermission.permissionId = createAccountPermission.permissionId;
    accountPermission.roleId = createAccountPermission.roleId;
    return accountPermission;
  }
}
export class UpdateAccountPermissionCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  permissionId: string;
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  currentUser: UserInfo;
  static fromCommand(
    updateAccountPermission: UpdateAccountPermissionCommand,
  ): AccountPermission {
    const accountPermission = new AccountPermission();
    accountPermission.id = updateAccountPermission.id;
    accountPermission.accountId = updateAccountPermission.accountId;
    accountPermission.permissionId = updateAccountPermission.permissionId;
    accountPermission.roleId = updateAccountPermission.roleId;
    return accountPermission;
  }
}
export class DeleteAccountPermissionCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  @ApiProperty()
  @IsNotEmpty()
  permissionId: string;
  currentUser: UserInfo;
}
export class ArchiveAccountPermissionCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
