import { ResetPasswordToken } from '@account/domains/reset-password/reset-password';
import { IResetPasswordTokenRepository } from '@account/domains/reset-password/reset-password.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetPasswordTokenEntity } from './reset-password.entity';
@Injectable()
export class ResetPasswordTokenRepository
  implements IResetPasswordTokenRepository
{
  constructor(
    @InjectRepository(ResetPasswordTokenEntity)
    private resetPasswordRepository: Repository<ResetPasswordTokenEntity>,
  ) {}
  async insert(resetPassword: ResetPasswordToken): Promise<ResetPasswordToken> {
    const resetPasswordEntity = this.toResetPasswordEntity(resetPassword);
    const result = await this.resetPasswordRepository.save(resetPasswordEntity);
    return result ? this.toResetPassword(result) : null;
  }
  async delete(accountId: string): Promise<boolean> {
    const result = await this.resetPasswordRepository.delete({
      accountId: accountId,
    });
    if (result.affected > 0) return true;
    return false;
  }
  async getAll(withDeleted: boolean): Promise<ResetPasswordToken[]> {
    const resetPasswords = await this.resetPasswordRepository.find({
      withDeleted: withDeleted,
    });
    if (!resetPasswords.length) {
      return null;
    }
    return resetPasswords.map((resetPassword) =>
      this.toResetPassword(resetPassword),
    );
  }
  async getByAccountId(
    accountId: string,
    withDeleted = false,
  ): Promise<ResetPasswordToken> {
    const resetPassword = await this.resetPasswordRepository.find({
      where: { accountId: accountId },
      order: { createdAt: 'desc' },
      withDeleted: withDeleted,
    });
    if (!resetPassword[0]) {
      return null;
    }
    return this.toResetPassword(resetPassword[0]);
  }
  async getByToken(
    token: string,
    withDeleted = false,
  ): Promise<ResetPasswordToken> {
    const resetPassword = await this.resetPasswordRepository.find({
      where: { token: token },
      withDeleted: withDeleted,
    });
    if (!resetPassword[0]) {
      return null;
    }
    return this.toResetPassword(resetPassword[0]);
  }
  toResetPassword(
    resetPasswordEntity: ResetPasswordTokenEntity,
  ): ResetPasswordToken {
    const resetPassword = new ResetPasswordToken();
    resetPassword.token = resetPasswordEntity.token;
    resetPassword.email = resetPasswordEntity.email;
    resetPassword.accountId = resetPasswordEntity.accountId;
    resetPassword.type = resetPasswordEntity.type;
    resetPassword.createdAt = resetPasswordEntity.createdAt;
    return resetPassword;
  }
  toResetPasswordEntity(
    resetPassword: ResetPasswordToken,
  ): ResetPasswordTokenEntity {
    const resetPasswordEntity = new ResetPasswordTokenEntity();
    resetPasswordEntity.token = resetPassword.token;
    resetPasswordEntity.email = resetPassword.email;
    resetPasswordEntity.accountId = resetPassword.accountId;
    resetPasswordEntity.type = resetPassword.type;
    resetPasswordEntity.createdAt = resetPassword.createdAt;
    return resetPasswordEntity;
  }
}
