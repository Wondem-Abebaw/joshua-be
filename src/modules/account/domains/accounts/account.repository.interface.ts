import { Account } from './account';
export interface IAccountRepository {
  insert(account: Account): Promise<Account>;
  update(account: Account): Promise<Account>;
  delete(id: string): Promise<boolean>;
  getAll(withDeleted: boolean): Promise<Account[]>;
  getById(id: string, withDeleted: boolean): Promise<Account>;
  getByPhoneNumber(phoneNumber: string, withDeleted: boolean): Promise<Account>;
  getByUsername(username: string, withDeleted: boolean): Promise<Account>;
  getByAccountId(accountId: string, withDeleted: boolean): Promise<Account>;
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}
