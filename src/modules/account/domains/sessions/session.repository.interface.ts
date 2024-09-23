import { Session } from './session';
export interface ISessionRepository {
  insert(session: Session): Promise<Session>;
  update(session: Session): Promise<Session>;
  delete(id: string): Promise<boolean>;
  getAll(withDeleted: boolean): Promise<Session[]>;
  getById(id: string, withDeleted: boolean): Promise<Session>;
  getByToken(token: string, withDeleted: boolean): Promise<Session>;
  getByRefreshToken(
    refreshToken: string,
    withDeleted: boolean,
  ): Promise<Session>;
  getByAccountId(sessionId: string, withDeleted: boolean): Promise<Session>;
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}
