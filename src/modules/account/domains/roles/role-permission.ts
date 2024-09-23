import { Permission } from '../permissions/permission';
import { Role } from '../roles/role';

export class RolePermission {
  id: string;
  permissionId: string;
  roleId: string;
  permission: Permission;
  role: Role;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deletedBy: string;
  archiveReason: string;
}
