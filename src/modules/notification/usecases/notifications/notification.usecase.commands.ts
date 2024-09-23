import {
  ArchiveNotificationCommand,
  CreateNotificationCommand,
  SendSmsCommand,
  UpdateNotificationCommand,
} from './notification.commands';
import { NotificationRepository } from '@notification/persistence/notifications/notification.repository';
import { NotificationResponse } from './notification.response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ACTIONS, MODELS } from '@libs/common/constants';
import { AccountRepository } from '@account/persistence/accounts/account.repository';
import { AppService } from 'app.service';
import { NotificationQuery } from './notification.usecase.queries';
import {
  CredentialType,
  NotificationMethod,
  NotificationTypes,
} from '@libs/common/enums';

import { CollectionQuery } from '@libs/collection-query/collection-query';
import { FilterOperators } from '@libs/collection-query/filter_operators';
import { AccountQuery } from '@account/usecases/accounts/account.usecase.queries';
@Injectable()
export class NotificationCommands {
  constructor(
    private notificationRepository: NotificationRepository,
    private readonly eventEmitter: EventEmitter2,
    private accountRepository: AccountRepository,
    private appService: AppService,

    private accountQuery: AccountQuery,
  ) {}
  @OnEvent('create.notification')
  async createNotification(command: CreateNotificationCommand): Promise<any> {
    const type = command.notificationType;
    if (type === NotificationTypes.Logout) {
      const account = await this.accountRepository.getByAccountId(
        command.receiver,
      );
      this.appService.sendNotification(account.fcmId, command, type);
      return true;
    }
    const notificationDomain = CreateNotificationCommand.fromCommand(command);
    const query = new CollectionQuery();
    if (command.type) {
      let totalAccounts = 0;
      let users: any;
      query.filter = [
        [
          {
            field: 'type',
            operator: FilterOperators.EqualTo,
            value: command.type,
          },
        ],
      ];
      const accounts = await this.accountQuery.getAllForNotification(query);
      totalAccounts = accounts.count;
      let newAccounts = [];
      // if (command.employmentStatus && command.employmentStatus !== 'all') {
      //   for (const account of accounts.data) {
      //     const customer = await this.employeeQuery.getEmployee(account.id);
      //     if (customer.employmentStatus === command.employmentStatus) {
      //       newAccounts.push(account);
      //     }
      //   }
      //   totalAccounts = newAccounts.length;
      // }
      if (totalAccounts > 1000) {
        const batchSize = 1000;
        let skip = 0;
        let offset = 1000;
        while (true) {
          if (skip >= totalAccounts) {
            break;
          }
          query.skip = skip;
          query.top = offset;
          const allUsers = await this.accountQuery.getAllForNotification(query);
          users = allUsers.data;
          let newUsers = [];
          // if (command.employmentStatus && command.employmentStatus !== 'all') {
          //   for (const account of accounts.data) {
          //     const customer = await this.employeeQuery.getEmployee(account.id);
          //     if (customer.employmentStatus === command.employmentStatus) {
          //       newUsers.push(account);
          //     }
          //   }
          //   users = newUsers;
          // }
          for (const user of users) {
            const account = await this.accountRepository.getByAccountId(
              user.id,
            );
            const smsCommand = new SendSmsCommand();
            smsCommand.phone = account.phoneNumber;
            smsCommand.message = command.body;
            if (command.method === NotificationMethod.Notification) {
              if (account && account.fcmId) {
                this.appService.sendNotification(account.fcmId, command);
              }
            } else if (command.method === NotificationMethod.Sms) {
              this.appService.sendSms(smsCommand);
            } else if (command.method === NotificationMethod.Both) {
              if (account && account.fcmId) {
                this.appService.sendNotification(account.fcmId, command);
              }
              this.appService.sendSms(smsCommand);
            }
            skip++;
          }
        }
        const notification = await this.notificationRepository.insert(
          notificationDomain,
        );
        const newNotification = await this.notificationRepository.getById(
          notification.id,
          ['accountReceiver'],
        );
        return newNotification;
      } else {
        const allUsers = await this.accountQuery.getAllForNotification(query);
        users = allUsers.data;
        let newUsers = [];
        // if (command.employmentStatus && command.employmentStatus !== 'all') {
        //   for (const account of accounts.data) {
        //     const customer = await this.employeeQuery.getEmployee(account.id);
        //     if (customer.employmentStatus === command.employmentStatus) {
        //       newUsers.push(account);
        //     }
        //   }
        //   users = newUsers;
        // }
        if (users && users.length > 0) {
          for (const user of users) {
            const account = await this.accountRepository.getByAccountId(
              user.id,
            );
            const smsCommand = new SendSmsCommand();
            smsCommand.phone = account.phoneNumber;
            smsCommand.message = command.body;
            if (command.method === NotificationMethod.Notification) {
              if (account && account.fcmId) {
                this.appService.sendNotification(account.fcmId, command);
              }
            } else if (command.method === NotificationMethod.Sms) {
              this.appService.sendSms(smsCommand);
            } else if (command.method === NotificationMethod.Both) {
              if (account && account.fcmId) {
                this.appService.sendNotification(account.fcmId, command);
              }
              this.appService.sendSms(smsCommand);
            }
          }
          const notification = await this.notificationRepository.insert(
            notificationDomain,
          );
          const newNotification = await this.notificationRepository.getById(
            notification.id,
            ['accountReceiver'],
          );
          return newNotification;
        }
        throw new NotFoundException(`No users found`);
      }
    } else {
      const account = await this.accountRepository.getByAccountId(
        command.receiver,
      );
      const smsCommand = new SendSmsCommand();
      smsCommand.phone = account.phoneNumber;
      smsCommand.message = command.body;
      if (command.method) {
        if (command.method === NotificationMethod.Notification) {
          if (account && account.fcmId) {
            this.appService.sendNotification(account.fcmId, command);
          }
        } else if (command.method === NotificationMethod.Sms) {
          this.appService.sendSms(smsCommand);
        } else {
          if (account && account.fcmId) {
            this.appService.sendNotification(account.fcmId, command);
          }
          this.appService.sendSms(smsCommand);
        }
      } else {
        if (account && account.fcmId) {
          this.appService.sendNotification(account.fcmId, command);
        }
        this.appService.sendSms(smsCommand);
      }
      notificationDomain.receiver = command.receiver;
      const notification = await this.notificationRepository.insert(
        notificationDomain,
      );
      const newNotification = await this.notificationRepository.getById(
        notification.id,
        ['accountReceiver'],
      );
      return NotificationResponse.fromEntity(newNotification);
    }
  }
  @OnEvent('send.sms.notification')
  async smsNotification(command: SendSmsCommand): Promise<any> {
    const smsCommand = new CreateNotificationCommand();
    smsCommand.title = command.phone;
    smsCommand.body = command.message;
    smsCommand.receiver = command.receiver;
    smsCommand.method = 'sms';
    const sms = await this.appService.sendGeezBulkSms(command);
    // const sms = await this.appService.sendSingleGeezSMS(command);
    return sms;
    // if (sms.acknowledge === 'success') {
    //   const notificationDomain =
    //     CreateNotificationCommand.fromCommand(smsCommand);
    //   const notification = await this.notificationRepository.insert(
    //     notificationDomain,
    //   );
    //   return NotificationResponse.fromEntity(notification);
    // }
  }
  async updateNotification(
    command: UpdateNotificationCommand,
  ): Promise<NotificationResponse> {
    const notificationDomain = await this.notificationRepository.getById(
      command.id,
    );
    if (!notificationDomain) {
      throw new NotFoundException(
        `Notification not found with id ${command.id}`,
      );
    }
    notificationDomain.title = command.title;
    notificationDomain.body = command.body;
    notificationDomain.receiver = command.receiver;
    notificationDomain.type = command.type;
    notificationDomain.employmentType = command.status;
    const notification = await this.notificationRepository.update(
      command.id,
      notificationDomain,
    );
    return NotificationResponse.fromEntity(notification);
  }
  async archiveNotification(
    command: ArchiveNotificationCommand,
  ): Promise<NotificationResponse> {
    const notificationDomain = await this.notificationRepository.getById(
      command.id,
    );
    if (!notificationDomain) {
      throw new NotFoundException(
        `Notification not found with id ${command.id}`,
      );
    }
    notificationDomain.deletedAt = new Date();
    notificationDomain.deletedBy = command?.currentUser?.id;
    notificationDomain.archiveReason = command.reason;
    const result = await this.notificationRepository.update(
      command.id,
      notificationDomain,
    );
    if (result) {
      this.eventEmitter.emit('activity-logger.store', {
        modelId: command.id,
        modelName: MODELS.NOTIFICATION,
        action: ACTIONS.ARCHIVE,
        userId: command.currentUser.id,
        user: command.currentUser,
        reason: command.reason,
      });
    }
    return NotificationResponse.fromEntity(result);
  }
  async restoreNotification(id: string): Promise<NotificationResponse> {
    const notificationDomain = await this.notificationRepository.getById(
      id,
      [],
      true,
    );
    if (!notificationDomain) {
      throw new NotFoundException(`Notification not found with id ${id}`);
    }
    const r = await this.notificationRepository.restore(id);
    if (r) {
      notificationDomain.deletedAt = null;
    }
    const newNotification = await this.notificationRepository.getById(id, [
      'accountReceiver',
    ]);
    return NotificationResponse.fromEntity(newNotification);
  }
  async deleteNotification(id: string): Promise<boolean> {
    const notificationDomain = await this.notificationRepository.getById(
      id,
      [],
      true,
    );
    if (!notificationDomain) {
      throw new NotFoundException(`Notification not found with id ${id}`);
    }
    return await this.notificationRepository.delete(id);
  }
  async changeNotificationStatus(id: string): Promise<boolean> {
    const notificationDomain = await this.notificationRepository.getAllBy(
      'receiver',
      id,
      [],
      true,
    );

    if (!notificationDomain) {
      throw new NotFoundException(
        `Notification not found with receiver Id ${id}`,
      );
    }
    for (const notification of notificationDomain) {
      notification.isSeen = true;
      const result = await this.notificationRepository.update(id, notification);
      if (!result) {
        return false;
      }
    }
    return true;
  }
}
