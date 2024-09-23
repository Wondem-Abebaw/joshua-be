import { CommonEntity } from '@libs/common/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';
import { RoleEntity } from '../roles/role.entity';

@Entity('account_roles')
export class AccountRoleEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
  @Column({ name: 'account_id', type: 'uuid', nullable: true })
  public accountId: string;
  @Column({ name: 'role_id', type: 'uuid' })
  public roleId: string;
  @ManyToOne(() => AccountEntity, (account) => account.accountRoles, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  public account: AccountEntity;
  @ManyToOne(() => RoleEntity, (role) => role.accountRoles, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  public role: RoleEntity;
}
