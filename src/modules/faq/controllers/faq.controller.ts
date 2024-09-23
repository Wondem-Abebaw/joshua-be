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
import {
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FaqCommands } from '../usecases/faq.usecase.commands';
import { FaqQuery } from '../usecases/faq.usecase.queries';
import {
  FileManagerHelper,
  FileManagerService,
} from '@libs/common/file-manager';
import { FaqResponse } from '../usecases/faq.response';
import { AllowAnonymous } from '@account/decorators/allow-anonymous.decorator';
import { ApiPaginatedResponse } from '@libs/response-format/api-paginated-response';
import { CollectionQuery } from '@libs/collection-query/collection-query';
import { PermissionsGuard } from '@account/guards/permission.quard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CurrentUser } from '@account/decorators/current-user.decorator';
import { UserInfo } from '@account/dtos/user-info.dto';
import {
  ArchiveFaqCommand,
  CreateFaqCommand,
  UpdateFaqCommand,
} from '../usecases/faq.commands';
import { IncludeQuery } from '@libs/collection-query/include-query';

@Controller('faqs')
@ApiTags('faqs')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class FaqController {
  constructor(
    private command: FaqCommands,
    private queries: FaqQuery,
    private readonly fileManagerService: FileManagerService,
  ) {}
  @Get('get-faq/:id')
  @ApiOkResponse({ type: FaqResponse })
  async getFaqById(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.queries.getFaqById(id, includeQuery.includes);
  }
  @Get('get-archived-faq/:id')
  @ApiOkResponse({ type: FaqResponse })
  async getArchivedFaqById(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.queries.getArchivedFaqById(id, includeQuery.includes, true);
  }
  @Get('get-faqs')
  @AllowAnonymous()
  @ApiPaginatedResponse(FaqResponse)
  async getFaq(@Query() query: CollectionQuery) {
    return this.queries.getAllFaq(query);
  }
  @Post('create-faq')
  @UseGuards(PermissionsGuard('manage-faqs'))
  //   @ApiConsumes('multipart/form-data')
  //   @UseInterceptors(
  //     FileInterceptor('coverImage', {
  //       storage: diskStorage({
  //         destination: FileManagerHelper.UPLOADED_FILES_DESTINATION,
  //       }),
  //       fileFilter: (request, file, callback) => {
  //         if (!file.mimetype.includes('image')) {
  //           return callback(
  //             new BadRequestException('Provide a valid image'),
  //             false,
  //           );
  //         }
  //         callback(null, true);
  //       },
  //       limits: { fileSize: 2 * Math.pow(1024, 2) },
  //     }),
  //   )
  @ApiOkResponse({ type: FaqResponse })
  async createFaq(
    @CurrentUser() user: UserInfo,
    @Body() createFaqCommand: CreateFaqCommand,
    // @UploadedFile() coverImage: Express.Multer.File,
  ) {
    // if (coverImage) {
    //   const result = await this.fileManagerService.uploadFile(
    //     coverImage,
    //     FileManagerHelper.UPLOADED_FILES_DESTINATION,
    //   );
    //   if (result) {
    //     createFaqCommand.coverImage = result;
    //   }
    // }
    createFaqCommand.currentUser = user;
    return this.command.createFaq(createFaqCommand);
  }
  @Put('update-faq')
  @UseGuards(PermissionsGuard('manage-faqs'))
  //   @ApiConsumes('multipart/form-data')
  //   @UseInterceptors(
  //     FileInterceptor('coverImage', {
  //       storage: diskStorage({
  //         destination: FileManagerHelper.UPLOADED_FILES_DESTINATION,
  //       }),
  //       fileFilter: (request, file, callback) => {
  //         if (file && !file.mimetype.includes('image')) {
  //           return callback(
  //             new BadRequestException('Provide a valid image'),
  //             false,
  //           );
  //         }
  //         callback(null, true);
  //       },
  //       limits: { fileSize: 2 * Math.pow(1024, 2) },
  //     }),
  //   )
  @ApiOkResponse({ type: FaqResponse })
  async updateFaq(
    @CurrentUser() user: UserInfo,
    @Body() updateFaqCommand: UpdateFaqCommand,
    // @UploadedFile() coverImage: Express.Multer.File,
  ) {
    // if (coverImage) {
    //   const result = await this.fileManagerService.uploadFile(
    //     coverImage,
    //     FileManagerHelper.UPLOADED_FILES_DESTINATION,
    //   );
    //   if (result) {
    //     updateFaqCommand.coverImage = result;
    //   }
    // }
    updateFaqCommand.currentUser = user;
    return this.command.updateFaq(updateFaqCommand);
  }
  @Delete('delete-faq/:id')
  @UseGuards(PermissionsGuard('manage-faqs'))
  @ApiOkResponse({ type: Boolean })
  async deleteFaq(@CurrentUser() user: UserInfo, @Param('id') id: string) {
    return this.command.deleteFaq(id, user);
  }
  @Delete('archive-faq')
  @UseGuards(PermissionsGuard('manage-faqs'))
  @ApiOkResponse({ type: FaqResponse })
  async archiveFaq(
    @CurrentUser() user: UserInfo,
    @Body() command: ArchiveFaqCommand,
  ) {
    command.currentUser = user;
    return this.command.archiveFaq(command);
  }
  @Post('restore-faq/:id')
  @UseGuards(PermissionsGuard('manage-faqs'))
  @ApiOkResponse({ type: FaqResponse })
  async restoreFaq(@CurrentUser() user: UserInfo, @Param('id') id: string) {
    return this.command.restoreFaq(id, user);
  }
  @Get('get-archived-faqs')
  @ApiPaginatedResponse(FaqResponse)
  async getArchivedFeedbacks(@Query() query: CollectionQuery) {
    return this.queries.getArchivedFaq(query);
  }
}
