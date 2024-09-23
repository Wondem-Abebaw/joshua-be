import { NotificationEntity } from '@notification/persistence/notifications/notification.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@libs/common/repositories/base.repository';

@Injectable()
export class NotificationRepository extends BaseRepository<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    notificationRepository: Repository<NotificationEntity>,
  ) {
    super(notificationRepository);
  }
}
