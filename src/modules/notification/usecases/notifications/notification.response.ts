import { NotificationEntity } from '@notification/persistence/notifications/notification.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AccountResponse } from '@account/usecases/accounts/account.response';

export class NotificationResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  body: string;
  @ApiProperty()
  receiver: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  isSeen: boolean;
  @ApiProperty()
  method: string;
  @ApiProperty()
  employmentType: string;
  @ApiProperty()
  employmentStatus: string;
  @ApiProperty()
  notificationType: string;
  @ApiProperty()
  isCompany: string;
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
  @ApiProperty()
  archiveReason: string;
  accountReceiver: AccountResponse;
  static fromEntity(
    notificationEntity: NotificationEntity,
  ): NotificationResponse {
    const notificationResponse = new NotificationResponse();
    notificationResponse.id = notificationEntity.id;
    notificationResponse.title = notificationEntity.title;
    notificationResponse.receiver = notificationEntity.receiver;
    notificationResponse.body = notificationEntity.body;
    notificationResponse.type = notificationEntity.type;
    notificationResponse.status = notificationEntity.employmentType;
    notificationResponse.isSeen = notificationEntity.isSeen;
    notificationResponse.method = notificationEntity.method;
    notificationResponse.employmentStatus = notificationEntity.employmentStatus;
    notificationResponse.isCompany = notificationEntity.isCompany;
    notificationResponse.employmentType = notificationEntity.employmentType;
    notificationResponse.notificationType = notificationEntity.notificationType;
    notificationResponse.archiveReason = notificationEntity.archiveReason;
    notificationResponse.createdBy = notificationEntity.createdBy;
    notificationResponse.updatedBy = notificationEntity.updatedBy;
    notificationResponse.deletedBy = notificationEntity.deletedBy;
    notificationResponse.createdAt = notificationEntity.createdAt;
    notificationResponse.updatedAt = notificationEntity.updatedAt;
    notificationResponse.deletedAt = notificationEntity.deletedAt;
    // if (notificationEntity.accountReceiver) {
    //   notificationResponse.accountReceiver = AccountResponse.fromEntity(
    //     notificationEntity.accountReceiver,
    //   );
    // }
    return notificationResponse;
  }
  // static fromDomain(notification: Notification): NotificationResponse {
  //   const notificationResponse = new NotificationResponse();
  //   notificationResponse.id = notification.id;
  //   notificationResponse.title = notification.title;
  //   notificationResponse.receiver = notification.receiver;
  //   notificationResponse.body = notification.body;
  //   notificationResponse.type = notification.type;
  //   notificationResponse.status = notification.status;
  //   notificationResponse.isSeen = notification.isSeen;
  //   notificationResponse.method = notification.method;
  //   notificationResponse.archiveReason = notification.archiveReason;
  //   notificationResponse.createdBy = notification.createdBy;
  //   notificationResponse.updatedBy = notification.updatedBy;
  //   notificationResponse.deletedBy = notification.deletedBy;
  //   notificationResponse.createdAt = notification.createdAt;
  //   notificationResponse.updatedAt = notification.updatedAt;
  //   notificationResponse.deletedAt = notification.deletedAt;
  //   if (notification.accountReceiver) {
  //     notificationResponse.accountReceiver = AccountResponse.fromDomain(
  //       notification.accountReceiver,
  //     );
  //   }
  //   return notificationResponse;
  // }
}
