import { CreateActivityCommand } from './activity.commands';
import { ActivityRepository } from '@activity-logger/persistence/activities/activity.repository';
import { ActivityResponse } from './activity.response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
@Injectable()
export class ActivityCommands {
  constructor(private activityRepository: ActivityRepository) {}
  @OnEvent('activity-logger.store')
  async createActivity(
    command: CreateActivityCommand,
  ): Promise<ActivityResponse> {
    const activityDomain = CreateActivityCommand.fromCommand(command);
    const activity = await this.activityRepository.insert(activityDomain);
    return ActivityResponse.fromEntity(activity);
  }
  async archiveActivity(id: string): Promise<boolean> {
    const activityDomain = await this.activityRepository.getById(id);
    if (!activityDomain) {
      throw new NotFoundException(`Activity not found with id ${id}`);
    }
    return await this.activityRepository.archive(id);
  }
  async restoreActivity(id: string): Promise<ActivityResponse> {
    const activityDomain = await this.activityRepository.getById(id, [], true);
    if (!activityDomain) {
      throw new NotFoundException(`Activity not found with id ${id}`);
    }
    const r = await this.activityRepository.restore(id);
    if (r) {
      activityDomain.deletedAt = null;
    }
    return ActivityResponse.fromEntity(activityDomain);
  }
  async deleteActivity(id: string): Promise<boolean> {
    const activityDomain = await this.activityRepository.getById(id, [], true);
    if (!activityDomain) {
      throw new NotFoundException(`Activity not found with id ${id}`);
    }
    return await this.activityRepository.delete(id);
  }
}
