import * as NodeRSA from 'node-rsa';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserInfo } from '@account/dtos/user-info.dto';
import * as jwt from 'jsonwebtoken';
export class Util {
  static decryptData(encryptedData: string) {
    try {
      const keyData = `-----BEGIN PUBLIC KEY-----\n${process.env.PublicKey}\n-----END PUBLIC KEY-----`;
      const rsaKey = new NodeRSA(keyData, 'public', {
        encryptionScheme: 'pkcs1',
      });
      const decryptedData = rsaKey.decryptPublic(encryptedData, 'utf8');
      return JSON.parse(decryptedData);
    } catch (error) {
      throw new Error(error);
    }
  }
  static encryptData(jsonString: string) {
    try {
      const keyData = `-----BEGIN PUBLIC KEY-----\n${process.env.PublicKey}\n-----END PUBLIC KEY-----`;
      const rsaKey = new NodeRSA(keyData, 'public', {
        encryptionScheme: 'pkcs1',
      });
      const data = Buffer.from(jsonString);
      const encryptedData = rsaKey.encrypt(data, 'base64', 'utf8');
      return encryptedData;
    } catch (error) {
      throw new Error(error);
    }
  }
  static signData(rawData: object) {
    const len = Object.keys(rawData).length;
    const signString = (Object.keys(rawData) as Array<keyof typeof rawData>)
      .sort()
      .reduce((acc, key, index) => {
        const isLast = index === len - 1;
        const value = rawData[key];
        return acc + `${key}=${value}${isLast ? '' : '&'}`;
      }, '');
    return crypto.createHash('sha256').update(signString).digest('hex');
  }
  static hashPassword(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword, Number(process.env.BcryptHashRound));
  }
  static comparePassword(
    plainPassword: string,
    encryptedPassword: string,
  ): boolean {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  }

  static generatePassword(length = 4): string {
    let password = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()-';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * charactersLength),
      );
    }
    return password;
  }
  static getTimeDifference(endTime: Date, startTime: Date): string {
    const diff = endTime.getTime() - startTime.getTime();
    let msec = diff;
    const hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    const mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    const ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    let result = hh ? hh.toString() : '00';
    result += ':' + (mm.toString() ? mm.toString() : '00');
    result += ':' + (ss.toString() ? ss.toString() : '00');
    return result;
  }
  static getPasswordFromCurrentDate(): string {
    const currentDate = new Date();
    const month =
      currentDate.getMonth() > 9
        ? currentDate.getMonth().toString()
        : '0' + currentDate.getMonth().toString();
    const date =
      currentDate.getDate() > 9
        ? currentDate.getDate().toString()
        : '0' + currentDate.getDate().toString();
    return currentDate.getFullYear().toString() + month + date;
  }
  static getTheLastMonday(date: Date) {
    const previousMonday = new Date();
    previousMonday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return previousMonday;
  }
  static GenerateToken(user: UserInfo, expiresIn = '1d') {
    return jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });
  }
  static GenerateRefreshToken(user: UserInfo, expiresIn = '365d') {
    return jwt.sign(user, process.env.REFRESH_SECRET_TOKEN, {
      expiresIn: expiresIn,
    });
  }
  static compareDate(date1: Date, date2: Date) {
    return date1.getTime() - date2.getTime();
  }
}
