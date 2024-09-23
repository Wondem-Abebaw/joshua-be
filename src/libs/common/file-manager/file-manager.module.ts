import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileManagerService } from './file-manager.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    // SftpModule.forRoot(
    //   {
    //     host: FileManagerHelper.SFTP_HOST,
    //     port: FileManagerHelper.SFTP_PORT,
    //     username: FileManagerHelper.SFTP_USERNAME,
    //     password: FileManagerHelper.SFTP_PASSWORD,
    //     debug: console.log,
    //   },
    //   false
    // ),
  ],
  providers: [FileManagerService],
})
export class FileManagerModule {}
