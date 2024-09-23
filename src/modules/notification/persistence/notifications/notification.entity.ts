import { AccountEntity } from '@account/persistence/accounts/account.entity';
import { BaseEntity } from '@libs/common/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column({ type: 'text' })
  body: string;
  @Column({ type: 'uuid', nullable: true })
  receiver: string;
  @Column({ nullable: true })
  type: string;
  @Column({ nullable: true })
  employmentType: string;
  @Column({ nullable: true })
  employmentStatus: string;
  @Column({ nullable: true })
  notificationType: string;
  @Column({ nullable: true })
  method: string;
  @Column({ name: 'is_company', default: 'all' })
  isCompany: string;
  @Column({ name: 'is_seen', default: false })
  isSeen: boolean;
  // @ManyToOne(
  //   () => AccountEntity,
  //   (accountReceiver) => accountReceiver.notificationReceiver,
  //   {
  //     orphanedRowAction: 'delete',
  //     onUpdate: 'CASCADE',
  //     onDelete: 'CASCADE',
  //   },
  // )
  // @JoinColumn({ name: 'receiver' })
  // accountReceiver: AccountEntity;
}
