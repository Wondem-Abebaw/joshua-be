import { Role } from '../roles/role';
import { Account } from './account';

export class AccountRole {
  id: string;
  accountId: string;
  roleId: string;
  account: Account;
  role: Role;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deletedBy: string;
  archiveReason: string;
}
