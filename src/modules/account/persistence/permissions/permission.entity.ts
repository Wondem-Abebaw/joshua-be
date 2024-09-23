import { CommonEntity } from '@libs/common/common.entity';
import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { AccountPermissionEntity } from '../accounts/account-permission.entity';
import { RolePermissionEntity } from '../roles/role-permission.entity';
@Entity('permissions')
export class PermissionEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  key: string;
  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.permission,
    {
      onDelete: 'CASCADE',
    },
  )
  public rolePermissions: RolePermissionEntity[];
  @OneToMany(
    () => AccountPermissionEntity,
    (accountPermission) => accountPermission.permission,
    {
      onDelete: 'CASCADE',
    },
  )
  public accountPermissions: AccountPermissionEntity[];
}
