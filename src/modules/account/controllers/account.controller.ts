import { AllowAnonymous } from '@account/decorators/allow-anonymous.decorator';
import { CurrentUser } from '@account/decorators/current-user.decorator';
import { UserInfo } from '@account/dtos/user-info.dto';
import { RolesGuard } from '@account/guards/role.quards';
import {
  AddAccountPermissionsCommand,
  ArchiveAccountPermissionCommand,
  DeleteAccountPermissionCommand,
} from '@account/usecases/accounts/account-permission.commands';
import { AccountPermissionResponse } from '@account/usecases/accounts/account-permission.response';
import {
  ArchiveAccountRoleCommand,
  CreateAccountRolesCommand,
  DeleteAccountRoleCommand,
} from '@account/usecases/accounts/account-role.commands';
import { AccountRoleResponse } from '@account/usecases/accounts/account-role.response';
import { UpgradePlanCommands } from '@account/usecases/accounts/account.commands';
import { AccountResponse } from '@account/usecases/accounts/account.response';
import { AccountCommands } from '@account/usecases/accounts/account.usecase.commands';
import { AccountQuery } from '@account/usecases/accounts/account.usecase.queries';
import { PermissionResponse } from '@account/usecases/permissions/permission.response';
import { RoleResponse } from '@account/usecases/roles/role.response';
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

@Controller('accounts')
@ApiTags('accounts')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class AccountsController {
  constructor(
    private command: AccountCommands,
    private accountQuery: AccountQuery,
  ) {}
  @Get('get-account/:id')
  @ApiOkResponse({ type: Boolean })
  async getAccount(@Param('id') id: string) {
    return this.accountQuery.getAccount(id);
  }
  @Get('check-account/:phone/:type')
  @AllowAnonymous()
  @ApiOkResponse({ type: AccountResponse })
  async checkAccount(
    @Param('phone') phone: string,
    @Param('type') type: string,
  ) {
    return this.accountQuery.checkAccount(phone, type);
  }
  @Get('get-accounts')
  @ApiPaginatedResponse(AccountResponse)
  async getAccounts(@Query() query: CollectionQuery) {
    return this.accountQuery.getAccounts(query);
  }
  @Get('get-archived-accounts')
  @ApiPaginatedResponse(AccountResponse)
  async getArchivedAccounts(@Query() query: CollectionQuery) {
    return this.accountQuery.getArchivedAccounts(query);
  }
  @Post('upgrade-plan')
  // @UseGuards(RolesGuard('admin|employer'))
  @ApiOkResponse({ type: AccountResponse })
  async upgradePlan(
    @CurrentUser() user: UserInfo,
    @Body() commands: UpgradePlanCommands,
  ) {
    commands.id = user.id;
    return this.command.upgradePlan(commands);
  }
  @Post('add-account-role')
  @UseGuards(RolesGuard('admin'))
  @ApiOkResponse({ type: RoleResponse, isArray: true })
  async addDriverAccountRole(
    @CurrentUser() user: UserInfo,
    @Body() command: CreateAccountRolesCommand,
  ) {
    command.currentUser = user;
    return this.command.addAccountRole(command);
  }
  @Delete('remove-account-role')
  @UseGuards(RolesGuard('admin'))
  @ApiOkResponse({ type: Boolean })
  async removeDriverAccountRole(
    @CurrentUser() user: UserInfo,
    @Body() removeAccountRoleCommand: DeleteAccountRoleCommand,
  ) {
    removeAccountRoleCommand.currentUser = user;
    return this.command.deleteAccountRole(removeAccountRoleCommand);
  }
  @Delete('archive-account-role')
  @UseGuards(RolesGuard('admin'))
  @ApiOkResponse({ type: Boolean })
  async archiveDriverAccountRole(
    @CurrentUser() user: UserInfo,
    @Body() archiveAccountRoleCommand: ArchiveAccountRoleCommand,
  ) {
    archiveAccountRoleCommand.currentUser = user;
    return this.command.archiveAccountRole(archiveAccountRoleCommand);
  }
  @Get('get-account-role/:id')
  @ApiOkResponse({ type: AccountRoleResponse })
  async getAccountRole(@Param('id') id: string) {
    return this.accountQuery.getAccountRole(id);
  }
  @Get('get-account-roles')
  @ApiPaginatedResponse(AccountRoleResponse)
  async getAccountRoles(@Query() query: CollectionQuery) {
    return this.accountQuery.getAccountRoles(query);
  }
  @Get('get-user-roles/:accountId')
  @ApiPaginatedResponse(RoleResponse)
  async getUserRoles(
    @Param('accountId') accountId: string,
    @Query() query: CollectionQuery,
  ) {
    return this.accountQuery.getRolesByAccountId(accountId, query);
  }
  @Get('get-user-permissions/:accountId')
  @ApiPaginatedResponse(PermissionResponse)
  async getUserPermissions(
    @Param('accountId') accountId: string,
    @Query() query: CollectionQuery,
  ) {
    return this.accountQuery.getPermissionsByAccountId(accountId, query);
  }
  @Get('get-user-permissions-by-role-id/:accountId/:roleId')
  @ApiPaginatedResponse(PermissionResponse)
  async getUserPermissionsByRoleId(
    @Param('accountId') accountId: string,
    @Param('roleId') roleId: string,
    @Query() query: CollectionQuery,
  ) {
    return this.accountQuery.getPermissionsByAccountIdAndRoleId(
      accountId,
      roleId,
      query,
    );
  }
  @Get('get-archived-account-roles')
  @ApiPaginatedResponse(AccountRoleResponse)
  async getArchivedAccountRoles(@Query() query: CollectionQuery) {
    return this.accountQuery.getArchivedAccountRoles(query);
  }
  @Post('restore-account-role')
  @UseGuards(RolesGuard('admin'))
  @ApiOkResponse({ type: AccountRoleResponse })
  async restoreDriverAccountRole(
    @CurrentUser() user: UserInfo,
    @Body() command: DeleteAccountRoleCommand,
  ) {
    command.currentUser = user;
    return this.command.restoreAccountRole(command);
  }
  //Account permission
  @Post('add-account-permission')
  @UseGuards(RolesGuard('admin'))
  @ApiOkResponse({ type: PermissionResponse, isArray: true })
  async addDriverAccountPermission(
    @CurrentUser() user: UserInfo,
    @Body() createAccountPermissionCommand: AddAccountPermissionsCommand,
  ) {
    createAccountPermissionCommand.currentUser = user;
    return this.command.addAccountPermission(createAccountPermissionCommand);
  }
  // @Put('update-account-permission')
  // @ApiOkResponse({ type: AccountPermissionResponse })
  // async updateDriverAccountPermission(
  //   @CurrentUser() user: UserInfo,
  //   @Body() updateAccountPermissionCommand: UpdateAccountPermissionCommand,
  // ) {
  //   updateAccountPermissionCommand.currentUser = user;
  //   return this.command.updateAccountPermission(updateAccountPermissionCommand);
  // }
  @Delete('remove-account-permission')
  @UseGuards(RolesGuard('admin'))
  @ApiOkResponse({ type: Boolean })
  async removeDriverAccountPermission(
    @CurrentUser() user: UserInfo,
    @Body() removeAccountPermissionCommand: DeleteAccountPermissionCommand,
  ) {
    removeAccountPermissionCommand.currentUser = user;
    return this.command.deleteAccountPermission(removeAccountPermissionCommand);
  }
  @Delete('archive-account-permission')
  @UseGuards(RolesGuard('admin'))
  @ApiOkResponse({ type: Boolean })
  async archiveDriverAccountPermission(
    @CurrentUser() user: UserInfo,
    @Body() archiveAccountPermissionCommand: ArchiveAccountPermissionCommand,
  ) {
    archiveAccountPermissionCommand.currentUser = user;
    return this.command.archiveAccountPermission(
      archiveAccountPermissionCommand,
    );
  }
  @Get('get-account-permission/:id')
  @ApiOkResponse({ type: AccountPermissionResponse })
  async getAccountPermission(@Param('id') id: string) {
    return this.accountQuery.getAccountPermission(id);
  }
  @Get('get-account-permissions')
  @ApiPaginatedResponse(AccountPermissionResponse)
  async getAccountPermissions(@Query() query: CollectionQuery) {
    return this.accountQuery.getAccountPermissions(query);
  }
  @Get('get-archived-account-permissions')
  @ApiPaginatedResponse(AccountPermissionResponse)
  async getArchivedAccountPermissions(@Query() query: CollectionQuery) {
    return this.accountQuery.getArchivedAccountPermissions(query);
  }
  @Post('restore-account-permission')
  @UseGuards(RolesGuard('admin'))
  @ApiOkResponse({ type: AccountPermissionResponse })
  async restoreDriverAccountPermission(
    @CurrentUser() user: UserInfo,
    @Body() command: DeleteAccountPermissionCommand,
  ) {
    command.currentUser = user;
    return this.command.restoreAccountPermission(command);
  }
}
