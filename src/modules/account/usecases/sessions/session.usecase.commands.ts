import { CreateSessionCommand, UpdateSessionCommand } from './session.commands';
import { SessionResponse } from './session.response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionRepository } from '@account/persistence/sessions/session.repository';
import { OnEvent } from '@nestjs/event-emitter';
@Injectable()
export class SessionCommands {
  constructor(private sessionRepository: SessionRepository) {}
  @OnEvent('create-session')
  async createSession(command: CreateSessionCommand): Promise<SessionResponse> {
    const sessionDomain = CreateSessionCommand.fromCommand(command);
    const session = await this.sessionRepository.insert(sessionDomain);
    return SessionResponse.fromDomain(session);
  }
  async deleteSessionByToken(token: string): Promise<void> {
    const sessionDomain = await this.sessionRepository.getByToken(token, true);
    if (sessionDomain) {
      await this.sessionRepository.delete(sessionDomain.id);
    }
  }
  async deleteSessionByRefreshToken(refreshToken: string): Promise<void> {
    const sessionDomain = await this.sessionRepository.getByToken(
      refreshToken,
      true,
    );
    if (sessionDomain) {
      await this.sessionRepository.delete(sessionDomain.id);
    }
  }
}
