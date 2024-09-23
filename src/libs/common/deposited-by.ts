import { ApiProperty } from '@nestjs/swagger';

export class DepositedBy {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  type: string;
}
