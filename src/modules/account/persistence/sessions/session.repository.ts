import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISessionRepository } from '@account/domains/sessions/session.repository.interface';
import { SessionEntity } from './session.entity';
import { Session } from '@account/domains/sessions/session';
@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}
  async insert(session: Session): Promise<Session> {
    const sessionEntity = this.toSessionEntity(session);
    const result = await this.sessionRepository.save(sessionEntity);
    return result ? this.toSession(result) : null;
  }
  async update(session: Session): Promise<Session> {
    const sessionEntity = this.toSessionEntity(session);
    const result = await this.sessionRepository.save(sessionEntity);
    return result ? this.toSession(result) : null;
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.sessionRepository.delete({ id: id });
    if (result.affected > 0) return true;
    return false;
  }
  async getAll(withDeleted: boolean): Promise<Session[]> {
    const sessions = await this.sessionRepository.find({
      relations: [],
      withDeleted: withDeleted,
    });
    if (!sessions.length) {
      return null;
    }
    return sessions.map((session) => this.toSession(session));
  }
  async getById(id: string, withDeleted = false): Promise<Session> {
    const session = await this.sessionRepository.find({
      where: { id: id },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!session[0]) {
      return null;
    }
    return this.toSession(session[0]);
  }
  async getByRefreshToken(
    refreshToken: string,
    withDeleted = false,
  ): Promise<Session> {
    const session = await this.sessionRepository.find({
      where: { refreshToken: refreshToken },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!session[0]) {
      return null;
    }
    return this.toSession(session[0]);
  }
  async getByToken(token: string, withDeleted = false): Promise<Session> {
    const session = await this.sessionRepository.find({
      where: { token: token },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!session[0]) {
      return null;
    }
    return this.toSession(session[0]);
  }
  async getByAccountId(
    accountId: string,
    withDeleted = false,
  ): Promise<Session> {
    const session = await this.sessionRepository.find({
      where: { id: accountId },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!session[0]) {
      return null;
    }
    return this.toSession(session[0]);
  }
  async archive(id: string): Promise<boolean> {
    const result = await this.sessionRepository.softDelete(id);
    if (result.affected > 0) return true;
    return false;
  }
  async restore(id: string): Promise<boolean> {
    const result = await this.sessionRepository.restore(id);
    if (result.affected > 0) return true;
    return false;
  }
  toSession(sessionEntity: SessionEntity): Session {
    const session = new Session();
    session.id = sessionEntity.id;
    session.accountId = sessionEntity.accountId;
    session.token = sessionEntity.token;
    session.refreshToken = sessionEntity.refreshToken;
    session.ipAddress = sessionEntity.ipAddress;
    session.userAgent = sessionEntity.userAgent;
    session.createdBy = sessionEntity.createdBy;
    session.updatedBy = sessionEntity.updatedBy;
    session.deletedBy = sessionEntity.deletedBy;
    session.createdAt = sessionEntity.createdAt;
    session.updatedAt = sessionEntity.updatedAt;
    session.deletedAt = sessionEntity.deletedAt;
    return session;
  }
  toSessionEntity(session: Session): SessionEntity {
    const sessionEntity = new SessionEntity();
    sessionEntity.id = session.id;
    sessionEntity.accountId = session.accountId;
    sessionEntity.token = session.token;
    sessionEntity.refreshToken = session.refreshToken;
    sessionEntity.ipAddress = session.ipAddress;
    sessionEntity.userAgent = session.userAgent;
    sessionEntity.createdBy = session.createdBy;
    sessionEntity.updatedBy = session.updatedBy;
    sessionEntity.deletedBy = session.deletedBy;
    sessionEntity.createdAt = session.createdAt;
    sessionEntity.updatedAt = session.updatedAt;
    sessionEntity.deletedAt = session.deletedAt;
    return sessionEntity;
  }
}
