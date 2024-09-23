import { ApiProperty } from '@nestjs/swagger';

export class AverageRate {
  @ApiProperty({ format: 'double precision' })
  rate: number;
  @ApiProperty()
  totalReviews: number;
}
