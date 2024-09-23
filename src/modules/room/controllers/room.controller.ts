import { diskStorage } from 'multer';

import { AllowAnonymous } from '@account/decorators/allow-anonymous.decorator';
import { CurrentUser } from '@account/decorators/current-user.decorator';
import { UserInfo } from '@account/dtos/user-info.dto';
import { PermissionsGuard } from '@account/guards/permission.quard';
import { CollectionQuery } from '@libs/collection-query/collection-query';
import {
  FileManagerHelper,
  FileManagerService,
  FileResponseDto,
} from '@libs/common/file-manager';
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
  Res,
  StreamableFile,
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
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import * as XLSX from 'xlsx';

import { IncludeQuery } from '@libs/collection-query/include-query';
import {
  CountByCreatedAtResponse,
  CountByStatusResponse,
  GroupByTypeResponse,
} from '@libs/common/count-by.response';
import { RoomCommands } from '../usecases/room.usecase.commands';
import { RoomQuery } from '../usecases/room.usecase.queries';
import { RoomResponse } from '../usecases/room.response';
import {
  ArchiveRoomCommand,
  CreateRoomCommand,
  UpdateRoomCommand,
} from '../usecases/room.commands';
@Controller('rooms')
@ApiTags('rooms')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class RoomController {
  constructor(
    private command: RoomCommands,
    private roomQuery: RoomQuery,
    private readonly fileManagerService: FileManagerService,
  ) {}
  @Get('get-room/:id')
  @AllowAnonymous()
  @ApiOkResponse({ type: RoomResponse })
  async getRoom(@Param('id') id: string, @Query() includeQuery: IncludeQuery) {
    return this.roomQuery.getRoom(id, includeQuery.includes);
  }
  @Get('get-archived-room/:id')
  @ApiOkResponse({ type: RoomResponse })
  async getArchivedRoom(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.roomQuery.getRoom(id, includeQuery.includes, true);
  }
  @Get('get-rooms')
  @ApiPaginatedResponse(RoomResponse)
  async getRooms(@Query() query: CollectionQuery) {
    return this.roomQuery.getRooms(query);
  }
  @Post('create-room')
  @UseGuards(PermissionsGuard('manage-rooms'))
  @UseInterceptors(
    FileInterceptor('roomImage', {
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
      limits: { fileSize: Math.pow(1024, 2) },
    }),
  )
  @ApiOkResponse({ type: RoomResponse })
  async createRoom(
    @CurrentUser() user: UserInfo,
    @Body() createRoomCommand: CreateRoomCommand,
    @UploadedFile() roomImage: Express.Multer.File,
  ) {
    if (roomImage) {
      const result = await this.fileManagerService.uploadFile(
        roomImage,
        FileManagerHelper.UPLOADED_FILES_DESTINATION,
      );
      if (result) {
        createRoomCommand.roomImage = result;
      }
    }
    createRoomCommand.currentUser = user;
    return this.command.createRoom(createRoomCommand);
  }
  @Put('update-room')
  @UseGuards(PermissionsGuard('manage-rooms'))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('roomImage', {
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
      limits: { fileSize: Math.pow(1024, 2) },
    }),
  )
  @ApiOkResponse({ type: RoomResponse })
  async updateRoom(
    @CurrentUser() user: UserInfo,
    @Body() updateRoomCommand: UpdateRoomCommand,
    @UploadedFile() roomImage: Express.Multer.File,
  ) {
    if (roomImage) {
      const result = await this.fileManagerService.uploadFile(
        roomImage,
        FileManagerHelper.UPLOADED_FILES_DESTINATION,
      );
      if (result) {
        updateRoomCommand.roomImage = result;
      }
    }
    updateRoomCommand.currentUser = user;
    return this.command.updateRoom(updateRoomCommand);
  }
  @Delete('archive-room')
  @UseGuards(PermissionsGuard('manage-rooms'))
  @ApiOkResponse({ type: RoomResponse })
  async archiveRoom(
    @CurrentUser() user: UserInfo,
    @Body() archiveCommand: ArchiveRoomCommand,
  ) {
    archiveCommand.currentUser = user;
    return this.command.archiveRoom(archiveCommand);
  }
  @Delete('delete-room/:id')
  @UseGuards(PermissionsGuard('manage-rooms'))
  @ApiOkResponse({ type: Boolean })
  async deleteRoom(@CurrentUser() user: UserInfo, @Param('id') id: string) {
    return this.command.deleteRoom(id, user);
  }
  @Post('restore-room/:id')
  @UseGuards(PermissionsGuard('manage-rooms'))
  @ApiOkResponse({ type: RoomResponse })
  async restoreRoom(@CurrentUser() user: UserInfo, @Param('id') id: string) {
    return this.command.restoreRoom(id, user);
  }
  @Get('get-archived-rooms')
  @ApiPaginatedResponse(RoomResponse)
  async getArchivedRooms(@Query() query: CollectionQuery) {
    return this.roomQuery.getArchivedRooms(query);
  }
  @Post('activate-or-block-room/:id')
  @UseGuards(PermissionsGuard('activate-or-block-rooms'))
  @ApiOkResponse({ type: RoomResponse })
  async activateOrBlockRoom(
    @CurrentUser() user: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.activateOrBlockRoom(id, user);
  }
  @Post('update-room-roomImage/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('roomImage', {
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
      limits: { fileSize: Math.pow(1024, 2) },
    }),
  )
  // async uploadRoomLogo(
  //   @Param('id') id: string,
  //   @UploadedFile() roomImage: Express.Multer.File,
  // ) {
  //   if (roomImage) {
  //     const result = await this.fileManagerService.uploadFile(
  //       roomImage,
  //       FileManagerHelper.UPLOADED_FILES_DESTINATION,
  //     );
  //     if (result) {
  //       return this.command.updateRoomLogo(id, result);
  //     }
  //   }
  //   throw new BadRequestException(`Bad Request`);
  // }
  @Get('export-rooms')
  @AllowAnonymous()
  async exportRooms(
    @Query() query: CollectionQuery,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const fileName = `rooms-${uuidv4()}.xlsx`;
    const filePath = `${FileManagerHelper.UPLOADED_FILES_DESTINATION}/${fileName}`;
    const rooms = await this.roomQuery.getRooms(query);
    const roomData = rooms.data;
    const rows = roomData.map((room) => {
      return {
        Name: room.name,
        'Created Date': room.createdAt,
      };
    });
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workBook, workSheet, `Rooms`);
    /* fix headers */
    XLSX.utils.sheet_add_aoa(
      workSheet,
      [['Name', 'Phone Number', 'Email', 'City', 'Sub City', 'Created Date']],
      {
        origin: 'A1',
      },
    );

    /* calculate column width */
    const max_width = rows.reduce((w, r) => Math.max(w, r['Name'].length), 10);
    workSheet['!cols'] = [{ wch: max_width }];
    XLSX.writeFile(workBook, filePath);
    const file: FileResponseDto = {
      filename: fileName,
      mimetype:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      originalname: fileName,
      path: filePath,
    };
    const stream = await this.fileManagerService.downloadFile(
      file,
      FileManagerHelper.UPLOADED_FILES_DESTINATION,
      response,
      true,
    );

    response.set({
      'Content-Disposition': `inline; filename="${file.originalname}"`,
      'Content-Type': file.mimetype,
    });

    return stream;
  }
  @Get('group-rooms-by-created-date/:format')
  @AllowAnonymous()
  @ApiOkResponse({ type: CountByCreatedAtResponse, isArray: true })
  async groupRoomsByCreatedDate(
    @Query() query: CollectionQuery,
    @Param('format') format: string,
  ) {
    return this.roomQuery.groupRoomsByCreatedDate(query, format);
  }
  @Get('group-rooms-by-enabled')
  @ApiOkResponse({ type: CountByStatusResponse, isArray: true })
  async groupRoomsByEnabled(@Query() query: CollectionQuery) {
    return this.roomQuery.groupRoomsByStatus(query);
  }
  @Get('group-rooms-by-type')
  @ApiOkResponse({ type: GroupByTypeResponse, isArray: true })
  async groupRoomsByType(@Query() query: CollectionQuery) {
    return this.roomQuery.groupRoomsByType(query);
  }
  //   @Get('group-rooms-by-address/:address')
  //   @ApiOkResponse({ type: GroupByAddressResponse, isArray: true })
  //   async groupRoomsByAddress(
  //     @Param('field') field: string,
  //     @Query() query: CollectionQuery,
  //   ) {
  //     return this.roomQuery.groupRoomsByAddress(field, query);
  //   }
}
