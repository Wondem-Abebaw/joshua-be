import { CollectionQuery } from '@libs/collection-query/collection-query';
import { FilterOperators } from '@libs/collection-query/filter_operators';
import { QueryConstructor } from '@libs/collection-query/query-constructor';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '@notification/persistence/notifications/notification.entity';
import { Repository } from 'typeorm';
import { NotificationResponse } from './notification.response';
@Injectable()
export class NotificationQuery {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}
  async getNotification(
    id: string,
    relations = [],
  ): Promise<NotificationResponse> {
    const notification = await this.notificationRepository.findOne({
      where: { id: id },
      relations,
    });
    if (!notification) {
      throw new NotFoundException(`Notification not found with id ${id}`);
    }
    return NotificationResponse.fromEntity(notification);
  }
  async getNotifications(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<NotificationResponse>> {
    const dataQuery = QueryConstructor.constructQuery<NotificationEntity>(
      this.notificationRepository,
      query,
    );
    const d = new DataResponseFormat<NotificationResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => NotificationResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async getMyNotifications(
    query: CollectionQuery,
    type: string,
    id: string,
  ): Promise<DataResponseFormat<NotificationResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'type',
        operator: FilterOperators.EqualTo,
        value: type,
      },
      {
        field: 'type',
        operator: FilterOperators.EqualTo,
        value: 'all',
      },
      {
        field: 'receiver',
        operator: FilterOperators.EqualTo,
        value: id,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<NotificationEntity>(
      this.notificationRepository,
      query,
    );
    const d = new DataResponseFormat<NotificationResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery
        .orderBy('created_at', 'DESC')
        .getManyAndCount();
      d.data = result.map((entity) => NotificationResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async getMyUnseenNotifications(
    query: CollectionQuery,
    type: string,
  ): Promise<number> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push(
      [
        {
          field: 'type',
          operator: FilterOperators.EqualTo,
          value: type,
        },
        {
          field: 'type',
          operator: FilterOperators.EqualTo,
          value: 'all',
        },
      ],
      [
        {
          field: 'is_seen',
          operator: FilterOperators.EqualTo,
          value: false,
        },
      ],
    );
    const dataQuery = QueryConstructor.constructQuery<NotificationEntity>(
      this.notificationRepository,
      query,
    );
    return dataQuery.getCount();
  }
  async getArchivedNotifications(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<NotificationResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<NotificationEntity>(
      this.notificationRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<NotificationResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => NotificationResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
}
