import { ApiProperty } from '@nestjs/swagger';

export class EmergencyContact {
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  name: string;
}
export class ContactPerson {
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  name: string;
}
