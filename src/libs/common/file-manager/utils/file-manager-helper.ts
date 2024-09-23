import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const FileManagerHelper = {
  // SFTP_HOST: process.env.SFTP_HOST,
  // SFTP_PORT: Number(process.env.SFTP_PORT),
  // SFTP_USERNAME: process.env.SFTP_USERNAME,
  // SFTP_PASSWORD: process.env.SFTP_PASSWORD,
  UPLOADED_FILES_DESTINATION: process.env.UPLOADED_FILES_DESTINATION,
};
