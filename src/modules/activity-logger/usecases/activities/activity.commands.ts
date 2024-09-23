import { UserInfo } from '@account/dtos/user-info.dto';
import { ActivityEntity } from '@activity-logger/persistence/activities/activity.entity';
import { Address } from '@libs/common/address';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
export class CreateActivityCommand {
  @ApiProperty()
  @IsNotEmpty()
  modelName: string;
  @ApiProperty()
  action: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  modelId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
  @ApiProperty()
  ip: string;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  @IsNotEmpty()
  user: UserInfo;
  @ApiProperty()
  oldPayload: object;
  @ApiProperty()
  payload: object;
  static fromCommand(command: CreateActivityCommand): ActivityEntity {
    const activity = new ActivityEntity();
    activity.modelName = command.modelName;
    activity.action = command.action;
    activity.modelId = command.modelId;
    activity.userId = command.userId;
    if (command.payload) {
      const difference = CreateActivityCommand.compareObject(
        { ...command.oldPayload },
        { ...command.payload },
      );
      activity.payload = difference.newPayload;
      activity.oldPayload = difference.oldPayload;
    }

    activity.user = command.user;
    activity.ip = command.ip;
    return activity;
  }
  static compareObject(oldPayload: object, newPayload: object) {
    const objectKeys = Object.keys(newPayload);
    for (const key of objectKeys) {
      if (
        (typeof newPayload[`${key}`] === 'object' ||
          Array.isArray(newPayload[`${key}`])) &&
        newPayload[`${key}`] !== null
      ) {
        if (
          JSON.stringify(newPayload[`${key}`]) ===
          JSON.stringify(oldPayload[`${key}`])
        ) {
          delete newPayload[`${key}`];
          delete oldPayload[`${key}`];
        }
      } else if (oldPayload[`${key}`] === newPayload[`${key}`]) {
        delete newPayload[`${key}`];
        delete oldPayload[`${key}`];
      } else if (oldPayload[`${key}`] === null) {
        delete oldPayload[`${key}`];
      } else if (newPayload[`${key}`] === null) {
        delete newPayload[`${key}`];
      }
    }
    return { oldPayload, newPayload };
  }
}
