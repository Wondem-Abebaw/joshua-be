import { UserInfo } from '@account/dtos/user-info.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@libs/common/entities/base.entity';
@Entity('activities')
export class ActivityEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'model_id', type: 'uuid' })
  modelId: string;
  @Column({
    name: 'model_name',
    nullable: true,
  })
  modelName: string;
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;
  @Column({
    name: 'action',
    nullable: true,
  })
  action: string;
  @Column({ nullable: true })
  ip?: string;
  @Column({ nullable: true, name: 'old_payload', type: 'jsonb' })
  oldPayload?: any;
  @Column({ nullable: true, name: 'payload', type: 'jsonb' })
  payload?: any;
  @Column({ nullable: true, name: 'user', type: 'jsonb' })
  user: UserInfo;
}
