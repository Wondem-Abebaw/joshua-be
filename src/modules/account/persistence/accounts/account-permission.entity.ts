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
import { PermissionEntity } from '../permissions/permission.entity';

@Entity('account_permissions')
export class AccountPermissionEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
  @Column({ name: 'account_id', type: 'uuid', nullable: true })
  public accountId: string;
  @Column({ name: 'role_id', type: 'uuid' })
  public roleId: string;
  @Column({ name: 'permission_id', type: 'uuid' })
  public permissionId: string;
  @ManyToOne(() => AccountEntity, (account) => account.accountPermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  public account: AccountEntity;
  @ManyToOne(() => RoleEntity, (role) => role.accountPermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  public role: RoleEntity;
  @ManyToOne(
    () => PermissionEntity,
    (permission) => permission.accountPermissions,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'permission_id' })
  public permission: PermissionEntity;
}
