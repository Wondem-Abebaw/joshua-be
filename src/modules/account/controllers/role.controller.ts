import { CurrentUser } from '@account/decorators/current-user.decorator';
import { UserInfo } from '@account/dtos/user-info.dto';
import { PermissionsGuard } from '@account/guards/permission.quard';
import { PermissionResponse } from '@account/usecases/permissions/permission.response';
import {
  ArchiveRolePermissionCommand,
  CreateRolePermissionsCommand,
  DeleteRolePermissionCommand,
} from '@account/usecases/roles/role-permission.commands';
import { RolePermissionResponse } from '@account/usecases/roles/role-permission.response';
import {
  ArchiveRoleCommand,
  CreateRoleCommand,
  UpdateRoleCommand,
} from '@account/usecases/roles/role.commands';
import { RoleResponse } from '@account/usecases/roles/role.response';
import { RoleCommands } from '@account/usecases/roles/role.usecase.commands';
import { RoleQueries } from '@account/usecases/roles/role.usecase.queries';
import { CollectionQuery } from '@libs/collection-query/collection-query';
import { ApiPaginatedResponse } from '@libs/response-format/api-paginated-response';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('roles')
@ApiTags('roles')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class RolesController {
  constructor(
    private readonly commands: RoleCommands,
    private readonly roleQueries: RoleQueries,
  ) {}
  @Get('get-role/:id')
  @ApiOkResponse({ type: RoleResponse })
  async getRole(@Param('id') id: string) {
    return this.roleQueries.getRole(id);
  }
  @Get('get-archived-role/:id')
  @ApiOkResponse({ type: RoleResponse })
  async getArchivedRole(@Param('id') id: string) {
    return this.roleQueries.getRole(id, true);
  }
  @Get('get-roles')
  @ApiPaginatedResponse(RoleResponse)
  async getRoles(@Query() query: CollectionQuery) {
    return this.roleQueries.getRoles(query);
  }
  @Post('update-role')
  @UseGuards(PermissionsGuard('manage-roles'))
  @ApiOkResponse({ type: RoleResponse })
  async updateRole(
    @CurrentUser() user: UserInfo,
    @Body() command: UpdateRoleCommand,
  ) {
    command.currentUser = user;
    return this.commands.updateRole(command);
  }
  @Post('create-role')
  @UseGuards(PermissionsGuard('manage-roles'))
  @ApiOkResponse({ type: RoleResponse })
  async createRole(
    @CurrentUser() user: UserInfo,
    @Body() createRoleCommand: CreateRoleCommand,
  ) {
    createRoleCommand.currentUser = user;
    return this.commands.createRole(createRoleCommand);
  }
  @Delete('archive-role')
  @UseGuards(PermissionsGuard('manage-roles'))
  @ApiOkResponse({ type: Boolean })
  async archiveRole(
    @CurrentUser() user: UserInfo,
    @Body() archiveCommand: ArchiveRoleCommand,
  ) {
    archiveCommand.currentUser = user;
    return this.commands.archiveRole(archiveCommand);
  }
  @Delete('delete-role/:id')
  @UseGuards(PermissionsGuard('manage-roles'))
  @ApiOkResponse({ type: Boolean })
  async deleteRole(@CurrentUser() user: UserInfo, @Param('id') id: string) {
    return this.commands.deleteRole(id, user);
  }
  @Post('restore-role/:id')
  @UseGuards(PermissionsGuard('manage-roles'))
  @ApiOkResponse({ type: RoleResponse })
  async restoreRole(@CurrentUser() user: UserInfo, @Param('id') id: string) {
    return this.commands.restoreRole(id, user);
  }
  @Get('get-archived-roles')
  @ApiPaginatedResponse(RoleResponse)
  async getArchivedRoles(@Query() query: CollectionQuery) {
    return this.roleQueries.getArchivedRoles(query);
  }

  @Post('add-role-permission')
  @ApiOkResponse({ type: PermissionResponse, isArray: true })
  async addDriverRolePermission(
    @CurrentUser() user: UserInfo,
    @Body() command: CreateRolePermissionsCommand,
  ) {
    command.currentUser = user;
    return this.commands.addRolePermission(command);
  }
  @Delete('remove-role-permission')
  @ApiOkResponse({ type: Boolean })
  async removeDriverRolePermission(
    @CurrentUser() user: UserInfo,
    @Body() removeRolePermissionCommand: DeleteRolePermissionCommand,
  ) {
    removeRolePermissionCommand.currentUser = user;
    return this.commands.deleteRolePermission(removeRolePermissionCommand);
  }
  @Delete('archive-role-permission')
  @ApiOkResponse({ type: Boolean })
  async archiveDriverRolePermission(
    @CurrentUser() user: UserInfo,
    @Body() archiveRolePermissionCommand: ArchiveRolePermissionCommand,
  ) {
    archiveRolePermissionCommand.currentUser = user;
    return this.commands.archiveRolePermission(archiveRolePermissionCommand);
  }
  @Get('get-role-permission/:id')
  @ApiOkResponse({ type: RolePermissionResponse })
  async getRolePermission(@Param('id') id: string) {
    return this.roleQueries.getRolePermission(id);
  }
  @Get('get-role-permissions')
  @ApiPaginatedResponse(RolePermissionResponse)
  async getRolePermissions(@Query() query: CollectionQuery) {
    return this.roleQueries.getRolePermissions(query);
  }
  @Get('get-archived-role-permissions')
  @ApiPaginatedResponse(RolePermissionResponse)
  async getArchivedRolePermissions(@Query() query: CollectionQuery) {
    return this.roleQueries.getArchivedRolePermissions(query);
  }
  @Post('restore-role-permission')
  @ApiOkResponse({ type: RolePermissionResponse })
  async restoreDriverRolePermission(
    @CurrentUser() user: UserInfo,
    @Body() command: DeleteRolePermissionCommand,
  ) {
    command.currentUser = user;
    return this.commands.restoreRolePermission(command);
  }
  @Get('get-role-permissions/:roleId')
  @ApiPaginatedResponse(PermissionResponse)
  async getUserPermissions(
    @Param('roleId') roleId: string,
    @Query() query: CollectionQuery,
  ) {
    return this.roleQueries.getPermissionsByRoleId(roleId, query);
  }
}
