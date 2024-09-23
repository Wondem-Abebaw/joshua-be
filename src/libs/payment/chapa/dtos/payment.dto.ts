import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  tx_ref: string;
  callback_url: string;
}
export class AcceptPaymentResponse {
  status: string;
  message: string;
  data: { checkout_url: string };
}
export class StartChapaPaymentResponse {
  @ApiProperty()
  status: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  checkout_url: string;
}
