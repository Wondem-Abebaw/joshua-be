import { Role } from './../../domains/roles/role';
import { RoleEntity } from './../../persistence/roles/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RoleResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  key: string;
  @ApiProperty()
  protected: boolean;
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
  static fromEntity(roleEntity: RoleEntity): RoleResponse {
    const roleResponse = new RoleResponse();
    roleResponse.id = roleEntity.id;
    roleResponse.name = roleEntity.name;
    roleResponse.key = roleEntity.key;
    roleResponse.protected = roleEntity.protected;
    roleResponse.createdBy = roleEntity.createdBy;
    roleResponse.updatedBy = roleEntity.updatedBy;
    roleResponse.deletedBy = roleEntity.deletedBy;
    roleResponse.createdAt = roleEntity.createdAt;
    roleResponse.updatedAt = roleEntity.updatedAt;
    roleResponse.deletedAt = roleEntity.deletedAt;
    return roleResponse;
  }
  static fromDomain(role: Role): RoleResponse {
    const roleResponse = new RoleResponse();
    roleResponse.id = role.id;
    roleResponse.name = role.name;
    roleResponse.key = role.key;
    roleResponse.protected = role.protected;
    roleResponse.createdBy = role.createdBy;
    roleResponse.updatedBy = role.updatedBy;
    roleResponse.deletedBy = role.deletedBy;
    roleResponse.createdAt = role.createdAt;
    roleResponse.updatedAt = role.updatedAt;
    roleResponse.deletedAt = role.deletedAt;
    return roleResponse;
  }
}
