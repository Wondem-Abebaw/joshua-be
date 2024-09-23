import { Module } from '@nestjs/common';
import { PaymentService } from './chapa/services/payment.service';

@Module({
  imports: [],
  providers: [PaymentService],
})
export class PaymentModule {}
