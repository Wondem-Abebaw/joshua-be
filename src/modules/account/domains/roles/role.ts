import { RolePermission } from './role-permission';

export class Role {
  id: string;
  name: string;
  key: string;
  protected: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deletedBy: string;
  archiveReason?: string;
  rolePermissions?: RolePermission[];
  async addRolePermission(rolePermission: RolePermission) {
    this.rolePermissions.push(rolePermission);
  }
  async updateRolePermission(rolePermission: RolePermission) {
    const existIndex = this.rolePermissions.findIndex(
      (element) => element.id == rolePermission.id,
    );
    this.rolePermissions[existIndex] = rolePermission;
  }
  async removeRolePermission(id: string) {
    this.rolePermissions = this.rolePermissions.filter(
      (element) => element.id != id,
    );
  }
  async updateRolePermissions(rolePermissions: RolePermission[]) {
    this.rolePermissions = rolePermissions;
  }
}
