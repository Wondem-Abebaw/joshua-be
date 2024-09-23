import { Permission } from './permission';
export interface IPermissionRepository {
  insert(role: Permission): Promise<Permission>;
  update(role: Permission): Promise<Permission>;
  updateMany(roles: Permission[]): Promise<Permission[]>;
  delete(id: string): Promise<boolean>;
  getAll(withDeleted: boolean): Promise<Permission[]>;
  getById(id: string, withDeleted: boolean): Promise<Permission>;
  getByName(name: string, withDeleted: boolean): Promise<Permission>;
  archive(id: string): Promise<boolean>;
  getByKey(key: string, withDeleted: boolean): Promise<Permission>;
  restore(id: string): Promise<boolean>;
}
