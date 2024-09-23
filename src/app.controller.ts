import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileManagerHelper } from '@libs/common/file-manager/utils/file-manager-helper';
import { FileResponseDto } from '@libs/common/file-manager/dtos/file-response.dto';
import { FileManagerService } from '@libs/common/file-manager';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as rawbody from 'raw-body';
import { Response } from 'express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@account/decorators/allow-anonymous.decorator';
import { Util } from '@libs/common/util';
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { validate } from 'class-validator';
import axios from 'axios';
import { AppService } from 'app.service';
@ApiTags('/')
@Controller('/')
export class AppController {
  private readonly instance = axios.create({
    baseURL: process.env.CHAPA_BASEURL, // Replace with your API endpoint
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  constructor(
    private readonly fileManagerService: FileManagerService,
    private eventEmitter: EventEmitter2,
    private appService: AppService,
  ) {}

  @Get('get-banks')
  @AllowAnonymous()
  async GetBanks(): Promise<any[]> {
    const accessToken = `${process.env.CHAPA_SECRET_KEY}`;
    this.instance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${accessToken}`;
    const response = await this.instance.get('/banks');
    return response.data;
  }
  @Get('send-code/:phone')
  @AllowAnonymous()
  async sendVerificationCode(@Param('phone') phone: string): Promise<any[]> {
    const response = await this.appService.sendVerificationCode(phone);
    return response;
  }
  @Get('verify-code/:code/:phone/:type')
  @AllowAnonymous()
  async verifyCode(
    @Param('code') code: string,
    @Param('phone') phone: string,
    @Param('type') type: string,
  ): Promise<any[]> {
    const response = await this.appService.verifyOtp(code, phone, type);
    return response;
  }
  @Get('download-file')
  @AllowAnonymous()
  async downloadFile(
    @Query() file: FileResponseDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    validate(file).then((errors) => {
      if (errors.length > 0) {
        throw new BadRequestException(`Bad request`);
      }
    });
    const stream = await this.fileManagerService.downloadFile(
      file,
      FileManagerHelper.UPLOADED_FILES_DESTINATION,
      response,
    );

    response.set({
      'Content-Disposition': `inline; filename="${file.originalname}"`,
      'Content-Type': file.mimetype,
    });

    return stream;
  }
  @Post('import-users')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('users', {
      storage: diskStorage({
        destination: FileManagerHelper.UPLOADED_FILES_DESTINATION,
      }),
      fileFilter: (request, file, callback) => {
        if (
          !file.mimetype.includes(
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          )
        ) {
          return callback(
            new BadRequestException('Provide a valid excel file'),
            false,
          );
        }
        callback(null, true);
      },

      limits: { fileSize: Math.pow(1024, 3) },
    }),
  )
  @AllowAnonymous()
  async readExcel(@UploadedFile() users: Express.Multer.File) {
    if (users) {
      const result = await this.fileManagerService.uploadFile(
        users,
        FileManagerHelper.UPLOADED_FILES_DESTINATION,
      );
      if (result) {
        const fileName = `${FileManagerHelper.UPLOADED_FILES_DESTINATION}/${result.filename}`;
        const file = XLSX.readFile(fileName);

        const data = [];

        const sheets = file.SheetNames;
        //for (let i = 0; i < sheets.length; i++) {
        const temp = XLSX.utils.sheet_to_json(
          file.Sheets[sheets[sheets.length - 1]],
        );
        temp.forEach((res) => {
          data.push(res);
        });
        // }
        // const ws = XLSX.utils.json_to_sheet(data);

        // XLSX.utils.book_append_sheet(file, ws, 'Sheet' + sheets.length + 1);

        // // Writing to our file
        // XLSX.writeFile(file, fileName);
        await this.fileManagerService.removeFile(
          result,
          FileManagerHelper.UPLOADED_FILES_DESTINATION,
        );
        return data;
        // return this.command.updateUserProfileImage(id, result);
      }
    }
    throw new BadRequestException(`Bad Request`);
  }
}
