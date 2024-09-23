import { Address } from '@libs/common/address';
import { FileDto } from '@libs/common/file-dto';
import { AccountPermission } from './account-permission';
import { AccountRole } from './account-role';

export class Account {
  id: string;
  name: string;
  username?: string;
  phoneNumber: string;
  email: string;
  type: string;
  isActive: boolean;
  password?: string;
  profileImage: FileDto;
  gender: string;
  fcmId: string;
  address: Address;
  planTypeId: string;
  planTypeDuration: number;
  // numberOfJobPosts: number;
  // numberOfRequests: number;
  verified: boolean;
  notifyMe: boolean;
  isPaid: boolean;
  isOnline: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
  accountRoles?: AccountRole[];
  accountPermissions?: AccountPermission[];
  // paymentPlan: PaymentPlan;

  async addAccountRole(accountRole: AccountRole) {
    this.accountRoles.push(accountRole);
  }
  async updateAccountRole(accountRole: AccountRole) {
    const existIndex = this.accountRoles.findIndex(
      (element) => element.id == accountRole.id,
    );
    this.accountRoles[existIndex] = accountRole;
  }
  async removeAccountRole(id: string) {
    this.accountRoles = this.accountRoles.filter((element) => element.id != id);
  }
  async updateAccountRoles(accountRoles: AccountRole[]) {
    this.accountRoles = accountRoles;
  }

  async addAccountPermission(accountPermission: AccountPermission) {
    this.accountPermissions.push(accountPermission);
  }
  async updateAccountPermission(accountPermission: AccountPermission) {
    const existIndex = this.accountPermissions.findIndex(
      (element) => element.id == accountPermission.id,
    );
    this.accountPermissions[existIndex] = accountPermission;
  }
  async removeAccountPermission(id: string) {
    this.accountPermissions = this.accountPermissions.filter(
      (element) => element.id != id,
    );
  }
  async updateAccountPermissions(accountPermissions: AccountPermission[]) {
    this.accountPermissions = accountPermissions;
  }
}
