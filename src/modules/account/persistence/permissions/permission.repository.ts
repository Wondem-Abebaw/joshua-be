import { Permission } from '@account/domains/permissions/permission';
import { IPermissionRepository } from '@account/domains/permissions/permission.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}
  async insert(permission: Permission): Promise<Permission> {
    const permissionEntity = this.toPermissionEntity(permission);
    const results = await this.permissionRepository.save(permissionEntity);
    return results ? this.toPermission(results) : null;
  }
  async update(permission: Permission): Promise<Permission> {
    const permissionEntity = this.toPermissionEntity(permission);
    const result = await this.permissionRepository.save(permissionEntity);
    return result ? this.toPermission(result) : null;
  }
  async getByKey(key: string, withDeleted = false): Promise<Permission> {
    const permission = await this.permissionRepository.find({
      where: { key: key },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!permission[0]) {
      return null;
    }
    return this.toPermission(permission[0]);
  }
  async updateMany(permissions: Permission[]): Promise<Permission[]> {
    const permissionEntities = permissions.map((permission) => {
      return this.toPermissionEntity(permission);
    });
    const result = await this.permissionRepository.save(permissionEntities);
    return result && result.length > 0
      ? result.map((permission) => this.toPermission(permission))
      : [];
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.permissionRepository.delete({ id: id });
    if (result.affected > 0) return true;
    return false;
  }
  async getAll(withDeleted: boolean): Promise<Permission[]> {
    const permissions = await this.permissionRepository.find({
      relations: [],
      withDeleted: withDeleted,
    });
    if (!permissions.length) {
      return null;
    }
    return permissions.map((permission) => this.toPermission(permission));
  }
  async getById(id: string, withDeleted = false): Promise<Permission> {
    const permission = await this.permissionRepository.find({
      where: { id: id },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!permission[0]) {
      return null;
    }
    return this.toPermission(permission[0]);
  }
  async getByName(name: string, withDeleted = false): Promise<Permission> {
    const permission = await this.permissionRepository.find({
      where: { name: name },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!permission[0]) {
      return null;
    }
    return this.toPermission(permission[0]);
  }
  async archive(id: string): Promise<boolean> {
    const result = await this.permissionRepository.softDelete(id);
    if (result.affected > 0) return true;
    return false;
  }
  async restore(id: string): Promise<boolean> {
    const result = await this.permissionRepository.restore(id);
    if (result.affected > 0) return true;
    return false;
  }
  toPermission(permissionEntity: PermissionEntity): Permission {
    const permission = new Permission();
    permission.id = permissionEntity.id;
    permission.name = permissionEntity.name;
    permission.key = permissionEntity.key;
    permission.createdBy = permissionEntity.createdBy;
    permission.updatedBy = permissionEntity.updatedBy;
    permission.deletedBy = permissionEntity.deletedBy;
    permission.createdAt = permissionEntity.createdAt;
    permission.updatedAt = permissionEntity.updatedAt;
    permission.deletedAt = permissionEntity.deletedAt;
    return permission;
  }
  toPermissionEntity(permission: Permission): PermissionEntity {
    const permissionEntity = new PermissionEntity();
    permissionEntity.id = permission.id;
    permissionEntity.name = permission.name;
    permissionEntity.key = permission.key;
    permissionEntity.createdBy = permission.createdBy;
    permissionEntity.updatedBy = permission.updatedBy;
    permissionEntity.deletedBy = permission.deletedBy;
    permissionEntity.createdAt = permission.createdAt;
    permissionEntity.updatedAt = permission.updatedAt;
    permissionEntity.deletedAt = permission.deletedAt;
    return permissionEntity;
  }
}
