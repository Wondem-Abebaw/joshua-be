import { Response } from 'express';
import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { FileResponseDto } from './dtos/file-response.dto';
import * as fs from 'fs';
import 'multer';

@Injectable()
export class FileManagerService {
  // constructor(private readonly sftpClient: SftpClientService) {}

  async downloadFile(
    file: FileResponseDto,
    basePath: string,
    response?: Response,
    deleteAfterCompleted = false,
  ): Promise<StreamableFile> {
    // const downloadPath = await this.sftpClient.download(
    //   `${basePath}/${file.filename}`,
    //   file.path
    // );
    const downloadPath = `${basePath}/${file.filename}`;
    const readStream = createReadStream(downloadPath.toString());
    if (deleteAfterCompleted) {
      response.on('finish', async function () {
        readStream.destroy();
        fs.access(downloadPath, (err) => {
          if (!err) {
            fs.unlink(downloadPath, (err) => {
              // console.log(err);
            });
          }
        });
        // console.log('the response has been sent');
      });
    }
    return new StreamableFile(readStream);
  }

  async uploadFile(
    file: Express.Multer.File,
    basePath: string,
  ): Promise<FileResponseDto> {
    return await this.uploadToRemoteFileServer(file, basePath);
  }

  async uploadFiles(
    files: Express.Multer.File[],
    basePath: string,
  ): Promise<FileResponseDto[]> {
    const responses: FileResponseDto[] = [];

    files.forEach(async (file) => {
      const response = await this.uploadToRemoteFileServer(file, basePath);
      responses.push(response);
    });

    return responses;
  }

  private async uploadToRemoteFileServer(
    file: Express.Multer.File,
    basePath: string,
  ): Promise<FileResponseDto> {
    // const folderExists = await this.sftpClient.exists(basePath);
    // if (!folderExists) {
    //   await this.sftpClient.makeDirectory(basePath);
    // }

    // await this.sftpClient.upload(file.path, `${basePath}/${file.filename}`, {
    //   flags: 'w',
    //   encoding: null,
    //   mode: 0o666,
    // });

    //await fs.unlink(file.path);

    return new FileResponseDto(
      file.filename,
      file.path,
      file.originalname,
      file.mimetype,
      file.size,
    );
  }
  async removeFile(file: FileResponseDto, basePath: string) {
    const filePath = `${basePath}/${file.filename}`;
    if (fs.existsSync(filePath)) {
      fs.access(filePath, (err) => {
        if (!err) {
          fs.unlink(filePath, (err) => {
            // console.log(err);
          });
        }
      });
    }
  }
}
