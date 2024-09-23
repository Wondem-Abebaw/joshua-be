import { AllowAnonymous } from '@account/decorators/allow-anonymous.decorator';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class CronService {
  constructor(private eventEmitter: EventEmitter2) {}
  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  @AllowAnonymous()
  async checkPaymentExpiry() {
    this.eventEmitter.emit('check.payment.expiry');
  }
  // @Cron(CronExpression.EVERY_DAY_AT_9PM)
  // @AllowAnonymous()
  // async completeAssignments() {
  //   this.eventEmitter.emit('check.job.deadline');
  // }
}
