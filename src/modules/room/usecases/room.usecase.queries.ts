import { CollectionQuery } from '@libs/collection-query/collection-query';
import { FilterOperators } from '@libs/collection-query/filter_operators';
import { QueryConstructor } from '@libs/collection-query/query-constructor';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RoomResponse } from './room.response';

import {
  CountByCreatedAtResponse,
  CountByStatusResponse,
  GroupByTypeResponse,
} from '@libs/common/count-by.response';
import { RoomEntity } from '../persistence/room.entity';

@Injectable()
export class RoomQuery {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}
  async getRoom(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<RoomResponse> {
    const parent = await this.roomRepository.findOne({
      where: { id: id },
      relations,
      withDeleted: withDeleted,
    });
    if (!parent) {
      throw new NotFoundException(`Room not found with id ${id}`);
    }
    return RoomResponse.fromEntity(parent);
  }
  async getRooms(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RoomResponse>> {
    const dataQuery = QueryConstructor.constructQuery<RoomEntity>(
      this.roomRepository,
      query,
    );
    const d = new DataResponseFormat<RoomResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => RoomResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async getArchivedRooms(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RoomResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<RoomEntity>(
      this.roomRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<RoomResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => RoomResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async groupRoomsByCreatedDate(
    query: CollectionQuery,
    format: string,
  ): Promise<CountByCreatedAtResponse[]> {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    let formatQ = '';
    if (format === 'year') {
      formatQ = 'YYYY';
    } else if (format === 'month') {
      formatQ = 'MM';
    } else if (format === 'date') {
      formatQ = 'MM-dd';
    }
    if (format !== 'year') {
      if (!query.filter) {
        query.filter = [];
      }
      query.filter.push([
        {
          field: 'rooms.created_at',
          value: [startOfYear.toISOString(), endOfYear.toISOString()],
          operator: FilterOperators.Between,
        },
      ]);
    }
    query.select = [];
    query.select.push(
      `to_char(rooms.created_at,'${formatQ}') as created_date`,
      // `rooms.employment_type as employment_type`,
      'COUNT(rooms.id)',
    );
    const dataQuery = QueryConstructor.constructQuery<RoomEntity>(
      this.roomRepository,
      query,
    );
    const data = await dataQuery
      .groupBy(`created_date`)
      // .addGroupBy('employment_type')
      .orderBy('created_date')
      .getRawMany();
    const countResponses = [];
    data.map((d) => {
      const countResponse = new CountByCreatedAtResponse();
      countResponse.createdAt = d.created_date;
      // countResponse.employmentType = d.employment_type;
      countResponse.count = d.count;
      countResponses.push(countResponse);
    });
    return countResponses;
  }
  async groupRoomsByStatus(
    query: CollectionQuery,
  ): Promise<CountByStatusResponse[]> {
    query.select = [];
    query.select.push('enabled as enabled', 'COUNT(rooms.id)');
    const dataQuery = QueryConstructor.constructQuery<RoomEntity>(
      this.roomRepository,
      query,
    );
    dataQuery.groupBy('rooms.enabled');
    const data = await dataQuery.getRawMany();
    const countResponses = [];
    data.map((d) => {
      const countResponse = new CountByStatusResponse();
      countResponse.status = d.enabled ? 'Active' : 'InActive';
      countResponse.count = d.count;
      countResponses.push(countResponse);
    });
    return countResponses;
  }
  async groupRoomsByType(
    query: CollectionQuery,
  ): Promise<GroupByTypeResponse[]> {
    query.select = [];
    query.select.push('is_private as is_private', 'COUNT(rooms.id)');
    const dataQuery = QueryConstructor.constructQuery<RoomEntity>(
      this.roomRepository,
      query,
    );
    dataQuery.groupBy('rooms.is_private');
    const data = await dataQuery.getRawMany();
    const countResponses = [];
    data.map((d) => {
      const countResponse: any = {};
      countResponse.type = d.is_private ? 'Private' : 'Public';
      countResponse.count = d.count;
      countResponses.push(countResponse);
    });
    return countResponses;
  }
}
