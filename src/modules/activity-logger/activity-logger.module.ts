import { ActivityEntity } from './persistence/activities/activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesController } from './controllers/activity.controller';
import { Module } from '@nestjs/common';
import { ActivityRepository } from './persistence/activities/activity.repository';
import { ActivityCommands } from './usecases/activities/activity.usecase.commands';
import { ActivityQuery } from './usecases/activities/activity.usecase.queries';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityEntity])],
  providers: [ActivityRepository, ActivityCommands, ActivityQuery],
  controllers: [ActivitiesController],
})
export class ActivityModule {}
