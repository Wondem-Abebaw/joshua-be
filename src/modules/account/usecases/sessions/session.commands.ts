import { Session } from '@account/domains/sessions/session';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateSessionCommand {
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty()
  @IsNotEmpty()
  token?: string;
  @ApiProperty()
  ipAddress?: string;
  @ApiProperty()
  userAgent?: string;
  static fromCommand(command: CreateSessionCommand): Session {
    const sessionDomain = new Session();
    sessionDomain.accountId = command.accountId;
    sessionDomain.refreshToken = command.refreshToken;
    sessionDomain.token = command.token;
    sessionDomain.ipAddress = command.ipAddress;
    sessionDomain.userAgent = command.userAgent;
    return sessionDomain;
  }
}
export class UpdateSessionCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty()
  @IsNotEmpty()
  token: string;
  @ApiProperty()
  ipAddress: string;
  @ApiProperty()
  userAgent: string;
}
