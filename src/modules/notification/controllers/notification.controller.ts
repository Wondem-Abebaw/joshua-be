import { CurrentUser } from '@account/decorators/current-user.decorator';
import { UserInfo } from '@account/dtos/user-info.dto';
import { PermissionsGuard } from '@account/guards/permission.quard';
import { CollectionQuery } from '@libs/collection-query/collection-query';
import { IncludeQuery } from '@libs/collection-query/include-query';
import { ApiPaginatedResponse } from '@libs/response-format/api-paginated-response';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ArchiveNotificationCommand,
  CreateNotificationCommand,
  SendSmsCommand,
  UpdateNotificationCommand,
} from '@notification/usecases/notifications/notification.commands';
import { NotificationResponse } from '@notification/usecases/notifications/notification.response';
import { NotificationCommands } from '@notification/usecases/notifications/notification.usecase.commands';
import { NotificationQuery } from '@notification/usecases/notifications/notification.usecase.queries';

@Controller('notifications')
@ApiTags('notifications')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class NotificationsController {
  constructor(
    private command: NotificationCommands,
    private notificationQuery: NotificationQuery,
  ) {}
  @Get('get-notification/:id')
  @ApiOkResponse({ type: NotificationResponse })
  async getNotification(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.notificationQuery.getNotification(id, includeQuery.includes);
  }
  @Get('get-notifications')
  @ApiPaginatedResponse(NotificationResponse)
  async getNotifications(@Query() query: CollectionQuery) {
    return this.notificationQuery.getNotifications(query);
  }
  @Get('get-my-notifications')
  @ApiPaginatedResponse(NotificationResponse)
  async getMyNotifications(
    @Query() query: CollectionQuery,
    @CurrentUser() user: UserInfo,
  ) {
    return this.notificationQuery.getMyNotifications(query, user.type, user.id);
  }
  @Get('get-my-unseen-notifications')
  @ApiPaginatedResponse(NotificationResponse)
  async getMyUnseenNotifications(
    @Query() query: CollectionQuery,
    @CurrentUser() user: UserInfo,
  ) {
    return this.notificationQuery.getMyUnseenNotifications(query, user.type);
  }
  @Post('create-notification')
  @UseGuards(PermissionsGuard('manage-notifications'))
  @ApiOkResponse({ type: NotificationResponse, isArray: true })
  async createNotification(
    @Body() createNotificationCommand: CreateNotificationCommand,
  ) {
    return this.command.createNotification(createNotificationCommand);
  }
  @Post('send-sms-notfication')
  @ApiConsumes('multipart/form-data')
  @UseGuards(PermissionsGuard('manage-notifications'))
  @ApiOkResponse({ type: NotificationResponse, isArray: true })
  async smsNotification(@Body() createSmsNotificationCommand: SendSmsCommand) {
    return this.command.smsNotification(createSmsNotificationCommand);
  }
  @Put('update-notification')
  @UseGuards(PermissionsGuard('manage-notifications'))
  @ApiOkResponse({ type: NotificationResponse })
  async updateNotification(
    @Body() updateNotificationCommand: UpdateNotificationCommand,
  ) {
    return this.command.updateNotification(updateNotificationCommand);
  }
  @Delete('archive-notification')
  @UseGuards(PermissionsGuard('manage-notifications'))
  @ApiOkResponse({ type: NotificationResponse })
  async archiveNotification(
    @CurrentUser() user: UserInfo,
    @Body() archiveCommand: ArchiveNotificationCommand,
  ) {
    archiveCommand.currentUser = user;
    return this.command.archiveNotification(archiveCommand);
  }
  @Delete('delete-notification/:id')
  @UseGuards(PermissionsGuard('manage-notifications'))
  @ApiOkResponse({ type: Boolean })
  async deleteNotification(@Param('id') id: string) {
    return this.command.deleteNotification(id);
  }
  @Post('restore-notification/:id')
  @UseGuards(PermissionsGuard('manage-notifications'))
  @ApiOkResponse({ type: NotificationResponse })
  async restoreNotification(@Param('id') id: string) {
    return this.command.restoreNotification(id);
  }
  @Get('get-archived-notifications')
  @ApiPaginatedResponse(NotificationResponse)
  async getArchivedNotifications(@Query() query: CollectionQuery) {
    return this.notificationQuery.getArchivedNotifications(query);
  }
  @Post('change-notification-status')
  @ApiOkResponse({ type: Boolean })
  async changeNotificationStatus(@CurrentUser() user: UserInfo) {
    return this.command.changeNotificationStatus(user.id);
  }
}
