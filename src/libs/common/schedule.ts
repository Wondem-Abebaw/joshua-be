import { ApiProperty } from '@nestjs/swagger';

export class DateTime {
  @ApiProperty()
  day: string;
  @ApiProperty()
  time: Time[];
}
export class Time {
  @ApiProperty()
  startTime: string;
  @ApiProperty()
  endTime: string;
  // @ApiProperty()
  // meridian: string;
}
export class AllDate {
  @ApiProperty()
  day: string;
  @ApiProperty()
  startTime: string;
  @ApiProperty()
  endTime: string;
}
