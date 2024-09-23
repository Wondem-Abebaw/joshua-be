import { ApiProperty } from '@nestjs/swagger';

export class Address {
  @ApiProperty()
  country: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  subCity: string;
  @ApiProperty()
  woreda: string;
  @ApiProperty()
  houseNumber: string;
  @ApiProperty()
  specificLocation: string;
}
