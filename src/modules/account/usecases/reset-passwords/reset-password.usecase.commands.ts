import { Injectable } from '@nestjs/common';
import { ResetPasswordTokenRepository } from '@account/persistence/reset-password/reset-password.repository';
import { CreateResetPasswordTokenCommand } from './reset-password.commands';
import { ResetPasswordToken } from '@account/domains/reset-password/reset-password';
@Injectable()
export class ResetPasswordTokenCommands {
  constructor(
    private resetPasswordTokenRepository: ResetPasswordTokenRepository,
  ) {}
  async createResetPasswordToken(
    command: CreateResetPasswordTokenCommand,
  ): Promise<ResetPasswordToken> {
    const resetPasswordTokenDomain =
      CreateResetPasswordTokenCommand.fromCommand(command);
    return await this.resetPasswordTokenRepository.insert(
      resetPasswordTokenDomain,
    );
  }
  async deleteResetPasswordToken(accountId: string): Promise<boolean> {
    return await this.resetPasswordTokenRepository.delete(accountId);
  }
}
