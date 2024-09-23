import { ResetPasswordToken } from './reset-password';
export interface IResetPasswordTokenRepository {
  insert(account: ResetPasswordToken): Promise<ResetPasswordToken>;
  delete(accountId: string): Promise<boolean>;
  getAll(withDeleted: boolean): Promise<ResetPasswordToken[]>;
  getByAccountId(
    accountId: string,
    withDeleted: boolean,
  ): Promise<ResetPasswordToken>;
  getByToken(token: string, withDeleted: boolean): Promise<ResetPasswordToken>;
}
