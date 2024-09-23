import { RolePermission } from '@account/domains/roles/role-permission';
import { UserInfo } from '@account/dtos/user-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateRolePermissionCommand {
  permissionId: string;
  roleId: string;
  currentUser?: UserInfo;
  static fromCommand(
    createRolePermission: CreateRolePermissionCommand,
  ): RolePermission {
    const accountRole = new RolePermission();
    accountRole.permissionId = createRolePermission.permissionId;
    accountRole.roleId = createRolePermission.roleId;
    return accountRole;
  }
}
export class CreateRolePermissionsCommand {
  @ApiProperty()
  @IsNotEmpty()
  permissions: string[];
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  currentUser: UserInfo;
}
export class UpdateRolePermissionCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  permissionId: string;
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  currentUser: UserInfo;
  static fromCommand(
    updateRolePermission: UpdateRolePermissionCommand,
  ): RolePermission {
    const accountRole = new RolePermission();
    accountRole.id = updateRolePermission.id;
    accountRole.permissionId = updateRolePermission.permissionId;
    accountRole.roleId = updateRolePermission.roleId;
    return accountRole;
  }
}
export class DeleteRolePermissionCommand {
  @ApiProperty()
  @IsNotEmpty()
  permissionId: string;
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  currentUser: UserInfo;
}
export class ArchiveRolePermissionCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
