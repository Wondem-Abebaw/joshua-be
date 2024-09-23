import { Address } from '@libs/common/address';
import { ContactPerson } from '@libs/common/emergency-contact';
import { FileDto } from '@libs/common/file-dto';
import { ApiProperty } from '@nestjs/swagger';
import { RoomEntity } from '../persistence/room.entity';

export class RoomResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  description: string;

  @ApiProperty()
  amenities: string[];
  @ApiProperty()
  roomImage: FileDto;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  status: string;
  @ApiProperty()
  enabled: boolean;
  @ApiProperty()
  archiveReason: string;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  deletedBy?: string;

  static fromEntity(roomEntity: RoomEntity): RoomResponse {
    const roomResponse = new RoomResponse();
    roomResponse.id = roomEntity.id;
    roomResponse.name = roomEntity.name;
    roomResponse.price = roomEntity.price;
    roomResponse.description = roomEntity.description;
    roomResponse.amenities = roomEntity.amenities;
    // roomResponse.isPrivate = roomEntity.isPrivate;

    roomResponse.status = roomEntity.status;
    roomResponse.enabled = roomEntity.enabled;

    roomResponse.archiveReason = roomEntity.archiveReason;
    roomResponse.createdBy = roomEntity.createdBy;
    roomResponse.updatedBy = roomEntity.updatedBy;
    roomResponse.deletedBy = roomEntity.deletedBy;
    roomResponse.createdAt = roomEntity.createdAt;
    roomResponse.updatedAt = roomEntity.updatedAt;
    roomResponse.deletedAt = roomEntity.deletedAt;
    if (roomEntity.roomImage) {
      roomResponse.roomImage = roomEntity.roomImage;
    }
    return roomResponse;
  }
}
