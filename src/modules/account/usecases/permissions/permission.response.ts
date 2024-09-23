import { Permission } from '../../domains/permissions/permission';
import { PermissionEntity } from '../../persistence/permissions/permission.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  key: string;
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
  static fromEntity(permissionEntity: PermissionEntity): PermissionResponse {
    const permissionResponse = new PermissionResponse();
    permissionResponse.id = permissionEntity.id;
    permissionResponse.name = permissionEntity.name;
    permissionResponse.key = permissionEntity.key;
    permissionResponse.createdBy = permissionEntity.createdBy;
    permissionResponse.updatedBy = permissionEntity.updatedBy;
    permissionResponse.deletedBy = permissionEntity.deletedBy;
    permissionResponse.createdAt = permissionEntity.createdAt;
    permissionResponse.updatedAt = permissionEntity.updatedAt;
    permissionResponse.deletedAt = permissionEntity.deletedAt;
    return permissionResponse;
  }
  static fromDomain(permission: Permission): PermissionResponse {
    const permissionResponse = new PermissionResponse();
    permissionResponse.id = permission.id;
    permissionResponse.name = permission.name;
    permissionResponse.key = permission.key;
    permissionResponse.createdBy = permission.createdBy;
    permissionResponse.updatedBy = permission.updatedBy;
    permissionResponse.deletedBy = permission.deletedBy;
    permissionResponse.createdAt = permission.createdAt;
    permissionResponse.updatedAt = permission.updatedAt;
    permissionResponse.deletedAt = permission.deletedAt;
    return permissionResponse;
  }
}
