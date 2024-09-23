import { Role } from './role';
export interface IRoleRepository {
  insert(role: Role): Promise<Role>;
  update(role: Role): Promise<Role>;
  updateMany(roles: Role[]): Promise<Role[]>;
  delete(id: string): Promise<boolean>;
  getAll(withDeleted: boolean): Promise<Role[]>;
  getById(id: string, withDeleted: boolean): Promise<Role>;
  getByName(name: string, withDeleted: boolean): Promise<Role>;
  getByKey(key: string, withDeleted: boolean): Promise<Role>;
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}
