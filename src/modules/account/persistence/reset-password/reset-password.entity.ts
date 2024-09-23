import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('reset_password_tokens')
export class ResetPasswordTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text' })
  token: string;
  @Column()
  email: string;
  @Column({ name: 'account_id', type: 'uuid', nullable: true })
  accountId: string;
  @Column()
  type: string;
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
  })
  createdAt: Date;
}
