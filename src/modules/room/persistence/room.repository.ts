import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@libs/common/repositories/base.repository';
import { RoomEntity } from './room.entity';

@Injectable()
export class RoomRepository extends BaseRepository<RoomEntity> {
  constructor(
    @InjectRepository(RoomEntity)
    roomRepository: Repository<RoomEntity>,
  ) {
    super(roomRepository);
  }
}
