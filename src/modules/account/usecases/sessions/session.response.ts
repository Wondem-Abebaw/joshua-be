import { Session } from '@account/domains/sessions/session';
import { SessionEntity } from '@account/persistence/sessions/session.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SessionResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  accountId: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty()
  token: string;
  @ApiProperty()
  ipAddress: string;
  @ApiProperty()
  userAgent?: string;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  deletedBy?: string;
  static fromEntity(sessionEntity: SessionEntity): SessionResponse {
    const sessionResponse = new SessionResponse();
    sessionResponse.id = sessionEntity.id;
    sessionResponse.accountId = sessionEntity.accountId;
    sessionResponse.refreshToken = sessionEntity.refreshToken;
    sessionResponse.token = sessionEntity.token;
    sessionResponse.ipAddress = sessionEntity.ipAddress;
    sessionResponse.userAgent = sessionEntity.userAgent;
    sessionResponse.createdBy = sessionEntity.createdBy;
    sessionResponse.updatedBy = sessionEntity.updatedBy;
    sessionResponse.deletedBy = sessionEntity.deletedBy;
    sessionResponse.createdAt = sessionEntity.createdAt;
    sessionResponse.updatedAt = sessionEntity.updatedAt;
    sessionResponse.deletedAt = sessionEntity.deletedAt;
    return sessionResponse;
  }
  static fromDomain(session: Session): SessionResponse {
    const sessionResponse = new SessionResponse();
    sessionResponse.id = session.id;
    sessionResponse.accountId = session.accountId;
    sessionResponse.refreshToken = session.refreshToken;
    sessionResponse.token = session.token;
    sessionResponse.ipAddress = session.ipAddress;
    sessionResponse.userAgent = session.userAgent;
    sessionResponse.createdBy = session.createdBy;
    sessionResponse.updatedBy = session.updatedBy;
    sessionResponse.deletedBy = session.deletedBy;
    sessionResponse.createdAt = session.createdAt;
    sessionResponse.updatedAt = session.updatedAt;
    sessionResponse.deletedAt = session.deletedAt;
    return sessionResponse;
  }
}
