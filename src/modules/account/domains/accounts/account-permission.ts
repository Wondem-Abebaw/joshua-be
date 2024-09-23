import { Permission } from '../permissions/permission';
import { Role } from '../roles/role';
import { Account } from './account';

export class AccountPermission {
  id: string;
  accountId: string;
  roleId: string;
  permissionId: string;
  account: Account;
  role: Role;
  permission: Permission;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deletedBy: string;
  archiveReason: string;
}
