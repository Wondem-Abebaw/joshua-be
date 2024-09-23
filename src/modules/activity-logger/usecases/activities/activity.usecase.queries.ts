import { CollectionQuery } from '@libs/collection-query/collection-query';
import { FilterOperators } from '@libs/collection-query/filter_operators';
import { QueryConstructor } from '@libs/collection-query/query-constructor';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityEntity } from '@activity-logger/persistence/activities/activity.entity';
import { Repository } from 'typeorm';
import { ActivityResponse } from './activity.response';
@Injectable()
export class ActivityQuery {
  constructor(
    @InjectRepository(ActivityEntity)
    private activityRepository: Repository<ActivityEntity>,
  ) {}
  async getActivity(id: string): Promise<ActivityResponse> {
    const activity = await this.activityRepository.find({
      where: { id: id },
    });
    if (!activity[0]) {
      throw new NotFoundException(`Activity not found with id ${id}`);
    }
    return ActivityResponse.fromEntity(activity[0]);
  }
  async getActivities(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<ActivityResponse>> {
    const dataQuery = QueryConstructor.constructQuery<ActivityEntity>(
      this.activityRepository,
      query,
    );
    const d = new DataResponseFormat<ActivityResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => ActivityResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async getArchivedActivities(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<ActivityResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<ActivityEntity>(
      this.activityRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<ActivityResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => ActivityResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
}
