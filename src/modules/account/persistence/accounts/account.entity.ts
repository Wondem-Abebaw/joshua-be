import { Address } from '@libs/common/address';
import { CommonEntity } from '@libs/common/common.entity';
import { FileDto } from '@libs/common/file-dto';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { AccountPermissionEntity } from './account-permission.entity';
import { AccountRoleEntity } from './account-role.entity';
import { NotificationEntity } from '@notification/persistence/notifications/notification.entity';
import { PlanTypeDuration, PlanType, RequestType } from '@libs/common/enums';
// import { PaymentEntity } from '@payment/persistence/payments/payment.entity';
// import { PaymentPlanEntity } from '@payment/persistence/payment-plans/payment-plan.entity';
// import { CommentEntity } from '@performance/persistence/performance/comment.entity';
// import { ChatEntity } from '@chat/persistence/chat.entity';

@Entity('accounts')
export class AccountEntity extends CommonEntity {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Index()
  @Column({ name: 'phone_number' })
  phoneNumber: string;
  @Column({ nullable: true })
  email: string;
  @Column()
  type: string;
  @Column({ nullable: true })
  gender: string;
  @Index()
  @Column({ nullable: true })
  username: string;
  @Column({ name: 'is_active' })
  isActive: boolean;
  @Column()
  password: string;
  @Column({ nullable: true, name: 'fcm_id' })
  fcmId: string;
  @Column({ name: 'address', type: 'jsonb', nullable: true })
  address: Address;
  @Column({ name: 'profile_image', type: 'jsonb', nullable: true })
  profileImage: FileDto;
  @Column({ default: false })
  verified: boolean;
  @Column({ name: 'notify_me', default: true })
  notifyMe: boolean;
  @Column({ name: 'plan_type_id', type: 'uuid', nullable: true })
  planTypeId: string;
  @Column({ name: 'plan_type_duration', default: PlanTypeDuration.Free })
  planTypeDuration: number;
  @Column({ name: 'is_paid', default: false })
  isPaid: boolean;
  @Column({ name: 'is_online', default: false })
  isOnline: boolean;
  @OneToMany(() => AccountRoleEntity, (accountRole) => accountRole.account, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public accountRoles: AccountRoleEntity[];
  @OneToMany(
    () => AccountPermissionEntity,
    (accountPermission) => accountPermission.account,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  public accountPermissions: AccountPermissionEntity[];
  // @OneToMany(() => NotificationEntity, (chat) => chat.accountReceiver, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  // })
  // notificationReceiver: NotificationEntity[];
  // @OneToMany(() => PaymentEntity, (chat) => chat.customer, {
  //   cascade: true,
  //   // onDelete: 'CASCADE',
  // })
  // payments: PaymentEntity[];
  // @ManyToOne(() => PaymentPlanEntity, (paymentPlan) => paymentPlan.accounts, {
  //   orphanedRowAction: 'delete',
  //   onUpdate: 'CASCADE',
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'plan_type_id' })
  // paymentPlan: PaymentPlanEntity;
  // @OneToMany(() => CommentEntity, (comment) => comment.user, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  // })
  // comments: CommentEntity;
  // @OneToMany(() => ChatEntity, (chat) => chat.accountSender, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  // })
  // chatSender: ChatEntity[];
  // @OneToMany(() => ChatEntity, (chat) => chat.accountReceiver, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  // })
  // chatReceiver: ChatEntity[];
}
