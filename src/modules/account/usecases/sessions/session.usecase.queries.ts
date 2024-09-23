import { CollectionQuery } from '@libs/collection-query/collection-query';
import { QueryConstructor } from '@libs/collection-query/query-constructor';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionResponse } from './session.response';
import { SessionEntity } from '@account/persistence/sessions/session.entity';
@Injectable()
export class SessionQuery {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}
  async getSession(id: string, withDeleted = false): Promise<SessionResponse> {
    const session = await this.sessionRepository.find({
      where: { id: id },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!session[0]) {
      return null;
    }
    return SessionResponse.fromEntity(session[0]);
  }
  async getSessionByRefreshToken(
    refreshToken: string,
    withDeleted = false,
  ): Promise<SessionResponse> {
    const session = await this.sessionRepository.find({
      where: { refreshToken: refreshToken },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!session[0]) {
      return null;
    }
    return SessionResponse.fromEntity(session[0]);
  }
  async getSessions(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<SessionResponse>> {
    const dataQuery = QueryConstructor.constructQuery<SessionEntity>(
      this.sessionRepository,
      query,
    );
    const d = new DataResponseFormat<SessionResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => SessionResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
}
