import { ActivityEntity } from '@activity-logger/persistence/activities/activity.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@libs/common/repositories/base.repository';
@Injectable()
export class ActivityRepository extends BaseRepository<ActivityEntity> {
  constructor(
    @InjectRepository(ActivityEntity)
    activityRepository: Repository<ActivityEntity>,
  ) {
    super(activityRepository);
  }
}
