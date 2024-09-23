import { UserInfo } from '@account/dtos/user-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationEntity } from '@notification/persistence/notifications/notification.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateNotificationCommand {
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  body: string;
  @ApiProperty()
  receiver: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  notificationType: string;
  @ApiProperty()
  employmentType: string;
  @ApiProperty()
  employmentStatus: string;
  @ApiProperty()
  isCompany: string;
  @ApiProperty()
  isSeen: boolean;
  @ApiProperty()
  method: string;
  static fromCommand(command: CreateNotificationCommand): NotificationEntity {
    const notification = new NotificationEntity();
    notification.title = command.title;
    notification.body = command.body;
    notification.receiver = command.receiver;
    notification.type = command.type;
    notification.employmentType = command.employmentType;
    notification.notificationType = command.notificationType;
    notification.employmentStatus = command.employmentStatus;
    notification.isCompany = command.isCompany;
    notification.isSeen = command.isSeen;
    notification.method = command.method;
    return notification;
  }
}

export class UpdateNotificationCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  body: string;
  @ApiProperty()
  @IsNotEmpty()
  receiver: string;
  @ApiProperty()
  @IsNotEmpty()
  type: string;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  @ApiProperty()
  isSeen: boolean;
  @ApiProperty()
  method: string;
  static fromCommand(command: UpdateNotificationCommand): NotificationEntity {
    const notification = new NotificationEntity();
    notification.id = command.id;
    notification.title = command.title;
    notification.body = command.body;
    notification.receiver = command.receiver;
    notification.type = command.type;
    notification.employmentType = command.status;
    notification.isSeen = command.isSeen;
    notification.method = command.method;
    return notification;
  }
}
export class ArchiveNotificationCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
export class SendSmsCommand {
  @ApiProperty()
  phone: string;
  @ApiProperty()
  phoneBulk: string[];
  @ApiProperty()
  @IsNotEmpty()
  message: string;
  receiver: string;
  token: string;
}
