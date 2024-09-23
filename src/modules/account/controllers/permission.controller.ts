import { AllowAnonymous } from '@account/decorators/allow-anonymous.decorator';
import { CurrentUser } from '@account/decorators/current-user.decorator';
import { UserInfo } from '@account/dtos/user-info.dto';
import { PermissionsGuard } from '@account/guards/permission.quard';
import {
  ArchivePermissionCommand,
  CreatePermissionCommand,
  UpdatePermissionCommand,
} from '@account/usecases/permissions/permission.commands';
import { PermissionResponse } from '@account/usecases/permissions/permission.response';
import { PermissionCommands } from '@account/usecases/permissions/permission.usecase.commands';
import { PermissionQueries } from '@account/usecases/permissions/permission.usecase.queries';
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

@Controller('permissions')
@ApiTags('permissions')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class PermissionsController {
  constructor(
    private readonly commands: PermissionCommands,
    private readonly permissionQueries: PermissionQueries,
  ) {}
  @Get('get-permission/:id')
  @ApiOkResponse({ type: PermissionResponse })
  async getPermission(@Param('id') id: string) {
    return this.permissionQueries.getPermission(id);
  }
  @Get('get-archived-permission/:id')
  @ApiOkResponse({ type: PermissionResponse })
  async getArchivedPermission(@Param('id') id: string) {
    return this.permissionQueries.getPermission(id, true);
  }
  @Get('get-permissions')
  @ApiPaginatedResponse(PermissionResponse)
  async getPermissions(@Query() query: CollectionQuery) {
    return this.permissionQueries.getPermissions(query);
  }
  @Post('update-permission')
  @UseGuards(PermissionsGuard('manage-permissions'))
  @ApiOkResponse({ type: PermissionResponse })
  async updatePermission(
    @CurrentUser() user: UserInfo,
    @Body() command: UpdatePermissionCommand,
  ) {
    command.currentUser = user;
    return this.commands.updatePermission(command);
  }
  @Post('create-permission')
  @UseGuards(PermissionsGuard('manage-permissions'))
  @ApiOkResponse({ type: PermissionResponse })
  async createPermission(
    @CurrentUser() user: UserInfo,
    @Body() createPermissionCommand: CreatePermissionCommand,
  ) {
    createPermissionCommand.currentUser = user;
    return this.commands.createPermission(createPermissionCommand);
  }
  @Delete('archive-permission')
  @UseGuards(PermissionsGuard('manage-permissions'))
  @ApiOkResponse({ type: Boolean })
  async archivePermission(
    @CurrentUser() user: UserInfo,
    @Body() archiveCommand: ArchivePermissionCommand,
  ) {
    archiveCommand.currentUser = user;
    return this.commands.archivePermission(archiveCommand);
  }
  @Delete('delete-permission/:id')
  @UseGuards(PermissionsGuard('manage-permissions'))
  @ApiOkResponse({ type: Boolean })
  async deletePermission(
    @CurrentUser() user: UserInfo,
    @Param('id') id: string,
  ) {
    return this.commands.deletePermission(id, user);
  }
  @Post('restore-permission/:id')
  @UseGuards(PermissionsGuard('manage-permissions'))
  @ApiOkResponse({ type: PermissionResponse })
  async restorePermission(
    @CurrentUser() user: UserInfo,
    @Param('id') id: string,
  ) {
    return this.commands.restorePermission(id, user);
  }
  @Get('get-archived-permissions')
  @ApiPaginatedResponse(PermissionResponse)
  async getArchivedPermissions(@Query() query: CollectionQuery) {
    return this.permissionQueries.getArchivedPermissions(query);
  }
}
