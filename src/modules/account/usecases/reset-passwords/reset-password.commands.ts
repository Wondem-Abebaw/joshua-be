import { ResetPasswordToken } from '@account/domains/reset-password/reset-password';

export class CreateResetPasswordTokenCommand {
  token: string;
  email: string;
  accountId: string;
  type: string;
  static fromCommand(
    command: CreateResetPasswordTokenCommand,
  ): ResetPasswordToken {
    const resetPasswordDomain = new ResetPasswordToken();
    resetPasswordDomain.token = command.token;
    resetPasswordDomain.email = command.email;
    resetPasswordDomain.accountId = command.accountId;
    resetPasswordDomain.type = command.type;
    return resetPasswordDomain;
  }
}
