import { RoleRepository } from './../../persistence/roles/role.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ArchiveRoleCommand,
  CreateRoleCommand,
  UpdateRoleCommand,
} from './role.commands';
import { RoleResponse } from './role.response';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  // OnModuleInit,
} from '@nestjs/common';
import { UserInfo } from '@account/dtos/user-info.dto';
import {
  ArchiveRolePermissionCommand,
  CreateRolePermissionCommand,
  CreateRolePermissionsCommand,
  DeleteRolePermissionCommand,
  UpdateRolePermissionCommand,
} from './role-permission.commands';
import { RolePermissionResponse } from './role-permission.response';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermissionEntity } from '@account/persistence/roles/role-permission.entity';
import { Repository } from 'typeorm';
import { Roles } from 'seeder';
import { Role } from '@account/domains/roles/role';
import { PermissionResponse } from '../permissions/permission.response';
import { PermissionQueries } from '../permissions/permission.usecase.queries';
import { CollectionQuery } from '@libs/collection-query/collection-query';
import { FilterOperators } from '@libs/collection-query/filter_operators';

@Injectable()
export class RoleCommands /*implements OnModuleInit*/ {
  constructor(
    private readonly roleRepository: RoleRepository,
    @InjectRepository(RolePermissionEntity)
    private rolePermissionRepository: Repository<RolePermissionEntity>,
    private permissionQueries: PermissionQueries,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  onModuleInit() {
    this.seedRole();
  }
  async seedRole(): Promise<void> {
    for (const role of Roles) {
      const existingRole = await this.roleRepository.getByKey(role.key);
      if (!existingRole) {
        const newRole = new Role();
        newRole.name = role.name;
        newRole.key = role.key;
        newRole.protected = role.protected ? role.protected : false;
        const insertedRole = await this.roleRepository.insert(newRole);
        if (insertedRole.key === 'super_admin') {
          this.eventEmitter.emit('account.create-super-admin', {
            roleId: insertedRole.id,
          });
        }
        // console.log('insertedRole', insertedRole);
      }
    }
  }
  async createRole(command: CreateRoleCommand): Promise<RoleResponse> {
    const existingRole = await this.roleRepository.getByName(command.name);
    if (existingRole) {
      throw new BadRequestException(`Role already exist`);
    }

    const roleDomain = CreateRoleCommand.fromCommand(command);
    roleDomain.createdBy = command.currentUser.id;
    roleDomain.updatedBy = command.currentUser.id;

    const role = await this.roleRepository.insert(roleDomain);
    const roleResponse = RoleResponse.fromDomain(role);
    if (role) {
    }
    return roleResponse;
  }
  async updateRole(command: UpdateRoleCommand): Promise<RoleResponse> {
    const role = await this.roleRepository.getById(command.id);
    if (!role) {
      throw new NotFoundException(`Role not found`);
    }
    const existingRole = await this.roleRepository.getByName(command.name);
    if (command.name !== role.name && existingRole) {
      throw new BadRequestException(
        `Role already exist with name ${command.name}`,
      );
    }
    role.name = command.name;
    role.key = command.key;
    role.updatedBy = command.currentUser.id;
    const result = await this.roleRepository.update(role);
    const roleResponse = RoleResponse.fromDomain(result);
    if (role) {
    }
    return roleResponse;
  }
  async archiveRole(command: ArchiveRoleCommand): Promise<RoleResponse> {
    const roleDomain = await this.roleRepository.getById(command.id);
    if (!roleDomain) {
      throw new NotFoundException(`Role not found with id ${command.id}`);
    }
    roleDomain.deletedAt = new Date();
    roleDomain.deletedBy = command.currentUser.id;
    const result = await this.roleRepository.update(roleDomain);
    return RoleResponse.fromDomain(result);
  }
  async restoreRole(id: string, currentUser: UserInfo): Promise<RoleResponse> {
    const roleDomain = await this.roleRepository.getById(id, true);
    if (!roleDomain) {
      throw new NotFoundException(`Role not found with id ${id}`);
    }
    const r = await this.roleRepository.restore(id);
    if (r) {
      roleDomain.deletedAt = null;
    }
    return RoleResponse.fromDomain(roleDomain);
  }
  async deleteRole(id: string, currentUser: UserInfo): Promise<boolean> {
    const roleDomain = await this.roleRepository.getById(id, true);
    if (!roleDomain) {
      throw new NotFoundException(`Role not found with id ${id}`);
    }
    return await this.roleRepository.delete(id);
  }
  async addRolePermission(
    command: CreateRolePermissionsCommand,
  ): Promise<PermissionResponse[]> {
    const roleDomain = await this.roleRepository.getById(command.roleId);
    if (!roleDomain) {
      throw new NotFoundException(` Role not found with id ${command.roleId}`);
    }
    // roleDomain.rolePermissions = [];
    for (const permissionId of command.permissions) {
      const rolePermission = CreateRolePermissionCommand.fromCommand({
        roleId: command.roleId,
        permissionId: permissionId,
      });
      roleDomain.addRolePermission(rolePermission);
    }

    const result = await this.roleRepository.update(roleDomain);
    if (!result) return null;

    const response = result.rolePermissions.map((rolePermission) =>
      RolePermissionResponse.fromDomain(rolePermission),
    );
    if (result.rolePermissions.length === 0) return [];
    const permissionIds = result.rolePermissions.map(
      (permission) => permission.permissionId,
    );
    const query = new CollectionQuery();
    query.filter = [
      [
        {
          field: 'id',
          operator: FilterOperators.In,
          value: permissionIds.join(','),
        },
      ],
    ];
    const responseData = await this.permissionQueries.getPermissions(query);
    return responseData.data;
  }
  async updateRolePermission(
    command: UpdateRolePermissionCommand,
  ): Promise<RolePermissionResponse> {
    const roleDomain = await this.roleRepository.getById(command.roleId);
    if (!roleDomain) {
      throw new NotFoundException(
        `Role does not found with id ${command.roleId}`,
      );
    }
    const oldPayload = roleDomain.rolePermissions.find(
      (b) => b.id === command.id,
    );
    if (oldPayload) {
      throw new BadRequestException(`Permission already assigned to this role`);
    }

    const rolePermission = UpdateRolePermissionCommand.fromCommand(command);
    roleDomain.updateRolePermission(rolePermission);
    const result = await this.roleRepository.update(roleDomain);
    if (!result) return null;

    const response = RolePermissionResponse.fromDomain(
      result.rolePermissions.find(
        (rolePermission) => rolePermission.id === command.id,
      ),
    );
    return response;
  }
  async deleteRolePermission(
    command: DeleteRolePermissionCommand,
  ): Promise<boolean> {
    const rolePermission = await this.rolePermissionRepository.find({
      where: { roleId: command.roleId, permissionId: command.permissionId },
      withDeleted: true,
    });
    if (!rolePermission[0]) {
      throw new NotFoundException(
        `Role permission not found with id ${command.permissionId}`,
      );
    }
    const result = await this.rolePermissionRepository.delete({
      id: rolePermission[0].id,
    });
    return result ? true : false;
  }
  async archiveRolePermission(
    command: ArchiveRolePermissionCommand,
  ): Promise<boolean> {
    const roleDomain = await this.roleRepository.getById(command.roleId);
    if (!roleDomain) {
      throw new NotFoundException(
        ` Role does not found with id ${command.roleId}`,
      );
    }
    const rolePermission = roleDomain.rolePermissions.find(
      (rolePermission) => rolePermission.id === command.id,
    );
    rolePermission.deletedAt = new Date();
    rolePermission.deletedBy = command.currentUser.id;
    rolePermission.archiveReason = command.reason;
    roleDomain.updateRolePermission(rolePermission);
    const result = await this.roleRepository.update(roleDomain);
    return result ? true : false;
  }
  async restoreRolePermission(
    command: DeleteRolePermissionCommand,
  ): Promise<RolePermissionResponse> {
    const rolePermission = await this.rolePermissionRepository.find({
      where: { id: command.permissionId },
      withDeleted: true,
    });
    if (!rolePermission[0]) {
      throw new NotFoundException(
        `Role Permission not found with id ${command.permissionId}`,
      );
    }
    rolePermission[0].deletedAt = null;
    const result = await this.rolePermissionRepository.save(rolePermission[0]);
    return RolePermissionResponse.fromEntity(result);
  }
}
