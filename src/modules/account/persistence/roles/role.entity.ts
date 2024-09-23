import { CommonEntity } from '@libs/common/common.entity';
import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { AccountPermissionEntity } from '../accounts/account-permission.entity';
import { AccountRoleEntity } from '../accounts/account-role.entity';
import { RolePermissionEntity } from './role-permission.entity';
@Entity('roles')
export class RoleEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  key: string;
  @Column({ default: false })
  protected: boolean;
  @OneToMany(() => AccountRoleEntity, (accountRole) => accountRole.role, {
    onDelete: 'CASCADE',
  })
  public accountRoles: AccountRoleEntity[];
  @OneToMany(
    () => AccountPermissionEntity,
    (accountPermission) => accountPermission.role,
    {
      onDelete: 'CASCADE',
    },
  )
  public accountPermissions: AccountPermissionEntity[];
  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.role,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  public rolePermissions: RolePermissionEntity[];
}
