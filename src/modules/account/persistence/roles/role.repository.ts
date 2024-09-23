import { Role } from '@account/domains/roles/role';
import { RolePermission } from '@account/domains/roles/role-permission';
import { IRoleRepository } from '@account/domains/roles/role.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermissionEntity } from './role-permission.entity';
import { RoleEntity } from './role.entity';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}
  async insert(role: Role): Promise<Role> {
    const roleEntity = this.toRoleEntity(role);
    const results = await this.roleRepository.save(roleEntity);
    return results ? this.toRole(results) : null;
  }
  async update(role: Role): Promise<Role> {
    const roleEntity = this.toRoleEntity(role);
    const result = await this.roleRepository.save(roleEntity);
    return result ? this.toRole(result) : null;
  }
  async updateMany(roles: Role[]): Promise<Role[]> {
    const roleEntities = roles.map((role) => {
      return this.toRoleEntity(role);
    });
    const result = await this.roleRepository.save(roleEntities);
    return result && result.length > 0
      ? result.map((role) => this.toRole(role))
      : [];
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.roleRepository.delete({ id: id });
    if (result.affected > 0) return true;
    return false;
  }
  async getAll(withDeleted: boolean): Promise<Role[]> {
    const roles = await this.roleRepository.find({
      relations: [],
      withDeleted: withDeleted,
    });
    if (!roles.length) {
      return null;
    }
    return roles.map((role) => this.toRole(role));
  }
  async getById(id: string, withDeleted = false): Promise<Role> {
    const role = await this.roleRepository.find({
      where: { id: id },
      relations: ['rolePermissions'],
      withDeleted: withDeleted,
    });
    if (!role[0]) {
      return null;
    }
    return this.toRole(role[0]);
  }
  async getByName(name: string, withDeleted = false): Promise<Role> {
    const role = await this.roleRepository.find({
      where: { name: name },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!role[0]) {
      return null;
    }
    return this.toRole(role[0]);
  }
  async getByKey(key: string, withDeleted = false): Promise<Role> {
    const role = await this.roleRepository.find({
      where: { key: key },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!role[0]) {
      return null;
    }
    return this.toRole(role[0]);
  }
  async archive(id: string): Promise<boolean> {
    const result = await this.roleRepository.softDelete(id);
    if (result.affected > 0) return true;
    return false;
  }
  async restore(id: string): Promise<boolean> {
    const result = await this.roleRepository.restore(id);
    if (result.affected > 0) return true;
    return false;
  }
  toRole(roleEntity: RoleEntity): Role {
    const role = new Role();
    role.id = roleEntity.id;
    role.name = roleEntity.name;
    role.key = roleEntity.key;
    role.protected = roleEntity.protected;
    role.createdBy = roleEntity.createdBy;
    role.updatedBy = roleEntity.updatedBy;
    role.deletedBy = roleEntity.deletedBy;
    role.createdAt = roleEntity.createdAt;
    role.updatedAt = roleEntity.updatedAt;
    role.deletedAt = roleEntity.deletedAt;
    role.rolePermissions = roleEntity.rolePermissions
      ? roleEntity.rolePermissions.map((rolePermission) =>
          this.toRolePermission(rolePermission),
        )
      : [];
    return role;
  }
  toRoleEntity(role: Role): RoleEntity {
    const roleEntity = new RoleEntity();
    roleEntity.id = role.id;
    roleEntity.name = role.name;
    roleEntity.key = role.key;
    roleEntity.protected = role.protected;
    roleEntity.createdBy = role.createdBy;
    roleEntity.updatedBy = role.updatedBy;
    roleEntity.deletedBy = role.deletedBy;
    roleEntity.createdAt = role.createdAt;
    roleEntity.updatedAt = role.updatedAt;
    roleEntity.deletedAt = role.deletedAt;
    roleEntity.rolePermissions = role.rolePermissions
      ? role.rolePermissions.map((rolePermission) =>
          this.toRolePermissionEntity(rolePermission),
        )
      : [];
    return roleEntity;
  }
  toRolePermission(rolePermissionEntity: RolePermissionEntity): RolePermission {
    const rolePermission = new RolePermission();
    rolePermission.id = rolePermissionEntity.id;
    rolePermission.permissionId = rolePermissionEntity.permissionId;
    rolePermission.roleId = rolePermissionEntity.roleId;
    rolePermission.archiveReason = rolePermissionEntity.archiveReason;
    rolePermission.createdBy = rolePermissionEntity.createdBy;
    rolePermission.updatedBy = rolePermissionEntity.updatedBy;
    rolePermission.deletedBy = rolePermissionEntity.deletedBy;
    rolePermission.createdAt = rolePermissionEntity.createdAt;
    rolePermission.updatedAt = rolePermissionEntity.updatedAt;
    rolePermission.deletedAt = rolePermissionEntity.deletedAt;
    return rolePermission;
  }
  toRolePermissionEntity(rolePermission: RolePermission): RolePermissionEntity {
    const rolePermissionEntity = new RolePermissionEntity();
    rolePermissionEntity.id = rolePermission.id;
    rolePermissionEntity.permissionId = rolePermission.permissionId;
    rolePermissionEntity.roleId = rolePermission.roleId;
    rolePermissionEntity.archiveReason = rolePermission.archiveReason;
    rolePermissionEntity.createdBy = rolePermission.createdBy;
    rolePermissionEntity.updatedBy = rolePermission.updatedBy;
    rolePermissionEntity.deletedBy = rolePermission.deletedBy;
    rolePermissionEntity.createdAt = rolePermission.createdAt;
    rolePermissionEntity.updatedAt = rolePermission.updatedAt;
    rolePermissionEntity.deletedAt = rolePermission.deletedAt;
    return rolePermissionEntity;
  }
}
