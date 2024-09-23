import { CommonEntity } from '@libs/common/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionEntity } from '../permissions/permission.entity';
import { RoleEntity } from './role.entity';

@Entity('role_permissions')
export class RolePermissionEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
  @Column({ name: 'role_id', type: 'uuid' })
  public roleId: string;
  @Column({ name: 'permission_id', type: 'uuid' })
  public permissionId: string;
  @ManyToOne(() => RoleEntity, (role) => role.rolePermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  public role: RoleEntity;
  @ManyToOne(
    () => PermissionEntity,
    (permission) => permission.rolePermissions,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'permission_id' })
  public permission: PermissionEntity;
}
