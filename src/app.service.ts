import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import axios from 'axios';
import { SendSmsCommand } from '@notification/usecases/notifications/notification.commands';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationTypes } from '@libs/common/enums';
@Injectable()
export class AppService {
  private apiKey = process.env.GOOGLE_DISTANCE_API;
  private afroApiKey = process.env.AFRO_API_KEY;
  private afroSenderId = process.env.AFRO_IDENTIFIER_ID;
  private afroSenderName = process.env.AFRO_SENDER_NAME;
  private afroBaseUrl: string = process.env.AFRO_BASE_URL;
  private afroSpaceBefore: string = process.env.AFRO_SPACE_BEFORE_OTP;
  private afroSpaceAfter: string = process.env.AFRO_SPACE_AFTER_OTP;
  private afroExpiresIn: string = process.env.AFRO_OTP_EXPIRES_IN_SECONDS;
  private afroLength: string = process.env.AFRO_OPT_LENGTH;
  private afroType: string = process.env.AFRO_OTP_TYPE;
  apiUrl = process.env.AFRO_BASE_URL;
  private geezToken = process.env.GEEZ_TOKEN;
  private geezUrl = process.env.GEEZ_BASE_URL;
  constructor(private eventEmitter: EventEmitter2) {}
  async sendNotification(
    token: string,
    notificationData: any,
    type: any = NotificationTypes.System,
    sender?: any,
  ) {
    if (token) {
      let title = '';
      if (sender) {
        title = sender.name;
      } else if (notificationData.title) {
        title = notificationData.title;
      }
      const notification = {
        notification: {
          title: title,
          body: notificationData.body,
        },
        data: {
          receiverId: notificationData.receiverId
            ? notificationData.receiverId
            : '',
          senderId: notificationData.senderId ? notificationData.senderId : '',
          createdAt: notificationData.createdAt
            ? JSON.stringify(notificationData.createdAt)
            : '',
          sender: sender ? JSON.stringify(sender) : '',
          type: type ? type : '',
        },
        token: token,
      };
      firebase
        .messaging()
        .send(notification)
        .then((response) => {
          console.log('res', response);
          return response;
        })
        .catch((error) => {
          console.log('err', error);
          return error;
        });
    }
  }
  async getDistance(origin: string, destination: string): Promise<number> {
    const apiKey = this.apiKey;
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const distance = response.data.rows[0].elements[0].distance.value;
      return distance;
    } catch (error) {
      throw new Error('Failed to get distance from API');
    }
  }
  async sendSms(command: SendSmsCommand) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/send`,
        {
          from: this.afroSenderId,
          sender: this.afroSenderName,
          to: command.phone,
          message: command.message,
        },
        {
          headers: {
            Authorization: `Bearer ${this.afroApiKey}`,
          },
        },
      );
      const responseData = response.data;
      return responseData;
    } catch (error) {
      // throw error;
      // throw new Error('Failed to send sms');
    }
  }
  async sendGeezBulkSmss(command: SendSmsCommand) {
    console.log('🚀 ~ AppService ~ sendGeezBulkSms ~ command:', command);
    console.log('🚀 ~ AppService ~ sendGeezBulkSms ~ command:', this.geezToken);
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.geezsms.com/api/v1/sms/lite/sendbulk?token=${this.geezToken}&phone=${command.phoneBulk}&msg=${command.message}`,
      headers: {},
    };
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      // throw error;
    }
  }
  async sendGeezBulkSms(command: SendSmsCommand): Promise<any> {
    try {
      const phoneJson = JSON.stringify(command.phoneBulk);
      const params = {
        token: this.geezToken,
        phone: phoneJson,
        msg: command.message,
      };
      console.log('🚀 ~ AppService ~ sendGeezBulkSms ~ params:', params);
      const response = await axios.get(`${this.geezUrl}/lite/sendbulk`, {
        params: params,
      });
      console.log('🚀 ~ AppService ~ sendGeezBulkSmss ~ response:', response);

      return response.data;
    } catch (error) {
      console.log(
        '🚀 ~ AppService ~ sendGeezBulkSms ~ error:',
        error.response.data.msg,
      );
      console.log(
        '🚀 ~ AppService ~ sendGeezBulkSms ~ error:',
        error.response.data['msg'],
      );
      // Handle the error appropriately
      throw new Error('Failed to send SMS. Error: ' + error.message);
    }
  }
  async sendSingleGeezSMS(command: SendSmsCommand) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${this.geezUrl}/send?token=${this.geezToken}&phone=${command.phone}&msg=${command.message}&shortcode_id=22`,
      headers: {},
    };
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      // throw error;
    }
  }
  async sendVerificationCode(phone: string): Promise<any> {
    const prefixMessage = 'Your Verification Code is';

    try {
      const response = await axios.get(`${this.afroBaseUrl}/challenge`, {
        params: {
          from: this.afroSenderId,
          sender: this.afroSenderName,
          to: phone,
          pr: prefixMessage,
          sb: this.afroSpaceBefore,
          sa: this.afroSpaceAfter,
          ttl: this.afroExpiresIn,
          len: this.afroLength,
          t: this.afroType,
        },
        headers: {
          Authorization: `Bearer ${this.afroApiKey}`,
        },
      });

      const responseData = response.data;
      if (responseData.acknowledge === 'success') {
        return { acknowledge: responseData.acknowledge };
      }
      return {
        acknowledge: responseData.acknowledge,
        message: responseData.response.errors,
      };
    } catch (error) {
      throw new Error('Failed to send code');
    }
  }
  async verifyOtp(code: string, phone: string, type: string): Promise<any> {
    try {
      const response = await axios.get(`${this.afroBaseUrl}/verify`, {
        params: {
          to: phone,
          code: code,
        },
        headers: {
          Authorization: `Bearer ${this.afroApiKey}`,
        },
      });

      const responseData = response.data;
      if (responseData.acknowledge === 'success') {
        this.eventEmitter.emit('verify.account', phone, type);
        return { acknowledge: responseData.acknowledge };
      }
      return {
        acknowledge: responseData.acknowledge,
        message: responseData.response.errors,
      };
    } catch (error) {
      throw new Error('Failed to verify code');
    }
  }
}
