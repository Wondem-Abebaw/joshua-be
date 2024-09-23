import { ActivityEntity } from '@activity-logger/persistence/activities/activity.entity';
import { UserInfo } from '@account/dtos/user-info.dto';
import { ApiProperty } from '@nestjs/swagger';
export class ActivityResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  modelId: string;
  @ApiProperty()
  modelName: string;
  @ApiProperty()
  userId?: string;
  @ApiProperty()
  action: string;
  @ApiProperty()
  ip?: string;
  @ApiProperty()
  oldPayload?: any;
  @ApiProperty()
  payload?: any;
  @ApiProperty()
  user: UserInfo;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  deletedBy?: string;
  static fromEntity(activityEntity: ActivityEntity): ActivityResponse {
    const activityResponse = new ActivityResponse();
    activityResponse.id = activityEntity.id;
    activityResponse.userId = activityEntity.userId;
    activityResponse.user = activityEntity.user;
    activityResponse.modelId = activityEntity.modelId;
    activityResponse.modelName = activityEntity.modelName;
    activityResponse.ip = activityEntity.ip;
    activityResponse.action = activityEntity.action;
    activityResponse.oldPayload = activityEntity.oldPayload;
    activityResponse.payload = activityEntity.payload;
    activityResponse.createdBy = activityEntity.createdBy;
    activityResponse.updatedBy = activityEntity.updatedBy;
    activityResponse.deletedBy = activityEntity.deletedBy;
    activityResponse.createdAt = activityEntity.createdAt;
    activityResponse.updatedAt = activityEntity.updatedAt;
    activityResponse.deletedAt = activityEntity.deletedAt;
    return activityResponse;
  }
  // static fromDomain(activity: Activity): ActivityResponse {
  //   const activityResponse = new ActivityResponse();
  //   activityResponse.id = activity.id;
  //   activityResponse.userId = activity.userId;
  //   activityResponse.user = activity.user;
  //   activityResponse.modelId = activity.modelId;
  //   activityResponse.modelName = activity.modelName;
  //   activityResponse.ip = activity.ip;
  //   activityResponse.oldPayload = activity.oldPayload;
  //   activityResponse.payload = activity.payload;
  //   activityResponse.action = activity.action;
  //   activityResponse.createdBy = activity.createdBy;
  //   activityResponse.updatedBy = activity.updatedBy;
  //   activityResponse.deletedBy = activity.deletedBy;
  //   activityResponse.createdAt = activity.createdAt;
  //   activityResponse.updatedAt = activity.updatedAt;
  //   activityResponse.deletedAt = activity.deletedAt;
  //   return activityResponse;
  // }
}
