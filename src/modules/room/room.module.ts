import { Module } from '@nestjs/common';
import { RoomController } from './controllers/room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './persistence/room.entity';
import { RoomCommands } from './usecases/room.usecase.commands';
import { RoomQuery } from './usecases/room.usecase.queries';
import { RoomRepository } from './persistence/room.repository';
import { FileManagerService } from '@libs/common/file-manager';

@Module({
  controllers: [RoomController],
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  providers: [RoomCommands, RoomQuery, RoomRepository, FileManagerService],
})
export class RoomModule {}
