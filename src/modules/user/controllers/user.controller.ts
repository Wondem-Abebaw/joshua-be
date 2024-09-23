import { diskStorage } from 'multer';

import { CurrentUser } from '@account/decorators/current-user.decorator';
import { UserInfo } from '@account/dtos/user-info.dto';
import { PermissionsGuard } from '@account/guards/permission.quard';
import { CollectionQuery } from '@libs/collection-query/collection-query';
import { FileManagerHelper } from '@libs/common/file-manager';
import { FileManagerService } from '@libs/common/file-manager/file-manager.service';
import { ApiPaginatedResponse } from '@libs/response-format/api-paginated-response';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ArchiveUserCommand,
  CreateUserCommand,
  UpdateUserCommand,
} from '@user/usecases/users/user.commands';
import { UserResponse } from '@user/usecases/users/user.response';
import { UserCommands } from '@user/usecases/users/user.usecase.commands';
import { UserQuery } from '@user/usecases/users/user.usecase.queries';
import { IncludeQuery } from '@libs/collection-query/include-query';
// import { GroupByStatusResponse } from '@libs/common/count-by-category.response';

@Controller('users')
@ApiTags('users')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class UsersController {
  constructor(
    private command: UserCommands,
    private userQuery: UserQuery,
    private readonly fileManagerService: FileManagerService,
  ) {}
  @Get('get-user/:id')
  @ApiOkResponse({ type: UserResponse })
  async getUser(@Param('id') id: string, @Query() includeQuery: IncludeQuery) {
    return this.userQuery.getUser(id, includeQuery.includes);
  }
  @Get('get-archived-user/:id')
  @ApiOkResponse({ type: UserResponse })
  async getArchivedUser(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.userQuery.getUser(id, includeQuery.includes, true);
  }
  @Get('get-users')
  @ApiPaginatedResponse(UserResponse)
  async getUsers(@Query() query: CollectionQuery) {
    return this.userQuery.getUsers(query);
  }
  // @Get('group-users-by-status')
  // @ApiOkResponse({ type: GroupByStatusResponse, isArray: true })
  // async groupPassengersByStatus(@Query() query: CollectionQuery) {
  //   return this.userQuery.groupUsersByStatus(query);
  // }
  @Post('create-user')
  //@AllowAnonymous()
  @UseGuards(PermissionsGuard('manage-users'))
  @ApiOkResponse({ type: UserResponse })
  async createUser(
    @CurrentUser() user: UserInfo,
    @Body() createUserCommand: CreateUserCommand,
  ) {
    createUserCommand.currentUser = user;
    return this.command.createUser(createUserCommand);
  }
  @Put('update-user')
  @UseGuards(PermissionsGuard('manage-users'))
  @ApiOkResponse({ type: UserResponse })
  async updateUser(
    @CurrentUser() user: UserInfo,
    @Body() updateUserCommand: UpdateUserCommand,
  ) {
    updateUserCommand.currentUser = user;
    return this.command.updateUser(updateUserCommand);
  }
  @Delete('archive-user')
  // @UseGuards(PermissionsGuard('manage-users'))
  @ApiOkResponse({ type: UserResponse })
  async archiveUser(
    @CurrentUser() user: UserInfo,
    @Body() archiveCommand: ArchiveUserCommand,
  ) {
    archiveCommand.currentUser = user;
    return this.command.archiveUser(archiveCommand);
  }
  @Delete('delete-user/:id')
  // @UseGuards(PermissionsGuard('manage-users'))
  @ApiOkResponse({ type: Boolean })
  async deleteUser(@CurrentUser() user: UserInfo, @Param('id') id: string) {
    return this.command.deleteUser(id, user);
  }
  @Post('restore-user/:id')
  // @UseGuards(PermissionsGuard('manage-users'))
  @ApiOkResponse({ type: UserResponse })
  async restoreUser(@CurrentUser() user: UserInfo, @Param('id') id: string) {
    return this.command.restoreUser(id, user);
  }
  @Get('get-archived-users')
  @ApiPaginatedResponse(UserResponse)
  async getArchivedUsers(@Query() query: CollectionQuery) {
    return this.userQuery.getArchivedUsers(query);
  }
  @Post('activate-or-block-user/:id')
  @UseGuards(PermissionsGuard('activate-or-block-users'))
  @ApiOkResponse({ type: UserResponse })
  async activateOrBlockUser(
    @CurrentUser() user: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.activateOrBlockUser(id, user);
  }
  @Post('update-profile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: FileManagerHelper.UPLOADED_FILES_DESTINATION,
      }),
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('image')) {
          return callback(
            new BadRequestException('Provide a valid image'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 2 * Math.pow(1024, 2) },
    }),
  )
  async addProfileImage(
    @CurrentUser() user: UserInfo,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    if (profileImage) {
      const result = await this.fileManagerService.uploadFile(
        profileImage,
        FileManagerHelper.UPLOADED_FILES_DESTINATION,
      );
      if (result) {
        return this.command.updateUserProfileImage(user.id, result);
      }
    }
    throw new BadRequestException(`Bad Request`);
  }
  @Post('update-user-profile-image/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: FileManagerHelper.UPLOADED_FILES_DESTINATION,
      }),
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('image')) {
          return callback(
            new BadRequestException('Provide a valid image'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 2 * Math.pow(1024, 2) },
    }),
  )
  async uploadUserProfileImage(
    @Param('id') id: string,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    if (profileImage) {
      const result = await this.fileManagerService.uploadFile(
        profileImage,
        FileManagerHelper.UPLOADED_FILES_DESTINATION,
      );
      if (result) {
        return this.command.updateUserProfileImage(id, result);
      }
    }
    throw new BadRequestException(`Bad Request`);
  }
}
