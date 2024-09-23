import { PermissionRepository } from '../../persistence/permissions/permission.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ArchivePermissionCommand,
  CreatePermissionCommand,
  UpdatePermissionCommand,
} from './permission.commands';
import { PermissionResponse } from './permission.response';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  // OnModuleInit,
} from '@nestjs/common';
import { UserInfo } from '@account/dtos/user-info.dto';
import { Permission } from '@account/domains/permissions/permission';
import { Permissions } from 'seeder';

@Injectable()
export class PermissionCommands /*implements OnModuleInit*/ {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  onModuleInit() {
    this.seedPermission();
  }
  async seedPermission(): Promise<void> {
    for (const permission of Permissions) {
      const existingPermission = await this.permissionRepository.getByKey(
        permission.key,
      );
      if (!existingPermission) {
        const newPermission = new Permission();
        newPermission.name = permission.name;
        newPermission.key = permission.key;
        const insertedPermission = await this.permissionRepository.insert(
          newPermission,
        );
      }
    }
  }
  async createPermission(
    command: CreatePermissionCommand,
  ): Promise<PermissionResponse> {
    const existingPermission = await this.permissionRepository.getByName(
      command.name,
    );
    if (existingPermission) {
      throw new BadRequestException(`Permission already exist`);
    }

    const permissionDomain = CreatePermissionCommand.fromCommand(command);
    permissionDomain.createdBy = command.currentUser.id;
    permissionDomain.updatedBy = command.currentUser.id;

    const permission = await this.permissionRepository.insert(permissionDomain);
    const permissionResponse = PermissionResponse.fromDomain(permission);
    if (permission) {
    }
    return permissionResponse;
  }
  async updatePermission(
    command: UpdatePermissionCommand,
  ): Promise<PermissionResponse> {
    const permission = await this.permissionRepository.getById(command.id);
    if (!permission) {
      throw new NotFoundException(`Permission not found`);
    }
    const existingPermission = await this.permissionRepository.getByName(
      command.name,
    );
    if (command.name !== permission.name && existingPermission) {
      throw new BadRequestException(
        `Permission already exist with name ${command.name}`,
      );
    }
    permission.name = command.name;
    permission.updatedBy = command.currentUser.id;
    permission.key = command.key;
    const result = await this.permissionRepository.update(permission);
    const permissionResponse = PermissionResponse.fromDomain(result);
    if (permission) {
    }
    return permissionResponse;
  }
  async archivePermission(
    command: ArchivePermissionCommand,
  ): Promise<PermissionResponse> {
    const permissionDomain = await this.permissionRepository.getById(
      command.id,
    );
    if (!permissionDomain) {
      throw new NotFoundException(`Permission not found with id ${command.id}`);
    }
    permissionDomain.deletedAt = new Date();
    permissionDomain.deletedBy = command.currentUser.id;
    const result = await this.permissionRepository.update(permissionDomain);
    return PermissionResponse.fromDomain(result);
  }
  async restorePermission(
    id: string,
    currentUser: UserInfo,
  ): Promise<PermissionResponse> {
    const permissionDomain = await this.permissionRepository.getById(id, true);
    if (!permissionDomain) {
      throw new NotFoundException(`Permission not found with id ${id}`);
    }
    const r = await this.permissionRepository.restore(id);
    if (r) {
      permissionDomain.deletedAt = null;
    }
    return PermissionResponse.fromDomain(permissionDomain);
  }
  async deletePermission(id: string, currentUser: UserInfo): Promise<boolean> {
    const permissionDomain = await this.permissionRepository.getById(id, true);
    if (!permissionDomain) {
      throw new NotFoundException(`Permission not found with id ${id}`);
    }
    return await this.permissionRepository.delete(id);
  }
}
