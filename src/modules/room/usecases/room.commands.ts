import { UserInfo } from '@account/dtos/user-info.dto';
import { Address } from '@libs/common/address';
import { ContactPerson } from '@libs/common/emergency-contact';
import { FileDto } from '@libs/common/file-dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { RoomEntity } from '../persistence/room.entity';

export class CreateRoomCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 0,
  })
  @IsNotEmpty()
  price: number;
  @ApiProperty()
  description: string;

  @ApiProperty()
  amenities: string[];
  @ApiProperty()
  roomImage: FileDto;
  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty()
  enabled: boolean;
  @ApiProperty()
  status: string;
  @ApiProperty()
  currentUser: UserInfo;
  static fromCommand(command: CreateRoomCommand): RoomEntity {
    const roomDomain = new RoomEntity();
    roomDomain.name = command.name;
    roomDomain.price = command.price;
    roomDomain.description = command.description;
    roomDomain.amenities = command.amenities;
    roomDomain.roomImage = command.roomImage;
    roomDomain.enabled = command.enabled;
    roomDomain.status = command.status;
    return roomDomain;
  }
}
export class UpdateRoomCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: 0,
  })
  @IsNotEmpty()
  price: number;
  @ApiProperty()
  description: string;

  @ApiProperty()
  amenities: string[];
  @ApiProperty()
  roomImage: FileDto;
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value.toLowerCase() === 'true') {
      return true;
    } else if (value.toLowerCase() === 'false') {
      return false;
    }
    throw new Error('Invalid boolean value');
  })
  isPrivate: boolean;

  @ApiProperty()
  status: string;
  @ApiProperty()
  enabled: boolean;
  @ApiProperty()
  currentUser: UserInfo;
}
export class ArchiveRoomCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
