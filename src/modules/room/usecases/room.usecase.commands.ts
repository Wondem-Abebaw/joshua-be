import {
  FileManagerHelper,
  FileManagerService,
  FileResponseDto,
} from '@libs/common/file-manager';
import { Util } from '@libs/common/util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ArchiveRoomCommand,
  CreateRoomCommand,
  UpdateRoomCommand,
} from './room.commands';
import { RoomResponse } from './room.response';
import { FileDto } from '@libs/common/file-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ACTIONS, MODELS } from '@libs/common/constants';
import { RoomRepository } from '../persistence/room.repository';
import { UserInfo } from '@account/dtos/user-info.dto';

@Injectable()
export class RoomCommands {
  constructor(
    private roomRepository: RoomRepository,
    private eventEmitter: EventEmitter2,
    private readonly fileManagerService: FileManagerService,
  ) {}

  async createRoom(command: CreateRoomCommand): Promise<RoomResponse> {
    if (
      command.name &&
      (await this.roomRepository.getOneBy('name', command.name, [], true))
    ) {
      throw new BadRequestException(`Room already exist with this name`);
    }

    const roomDomain = CreateRoomCommand.fromCommand(command);
    const room = await this.roomRepository.insert(roomDomain);

    return RoomResponse.fromEntity(room);
  }
  async updateRoom(command: UpdateRoomCommand): Promise<RoomResponse> {
    const roomDomain = await this.roomRepository.getById(command.id);
    if (!roomDomain) {
      throw new NotFoundException(`Room not found with id ${command.id}`);
    }

    const existingName = await this.roomRepository.getOneBy(
      'name',
      command.name,
      [],
      true,
    );
    if (command.name && existingName && existingName.id !== command.id) {
      throw new BadRequestException(`Room already exist with this name`);
    }

    const oldPayload = { ...roomDomain };

    roomDomain.name = command.name;
    roomDomain.description = command.description;
    roomDomain.price = command.price;
    roomDomain.status = command.status;
    roomDomain.amenities = command.amenities;
    roomDomain.enabled = command.enabled;
    if (command.roomImage && roomDomain.roomImage) {
      await this.fileManagerService.removeFile(
        roomDomain.roomImage,
        FileManagerHelper.UPLOADED_FILES_DESTINATION,
      );
    }
    roomDomain.roomImage = command.roomImage;
    const room = await this.roomRepository.update(roomDomain.id, roomDomain);
    if (room) {
      this.eventEmitter.emit('activity-logger.store', {
        modelId: room.id,
        modelName: MODELS.ROOM,
        action: ACTIONS.UPDATE,
        userId: command.currentUser.id,
        user: command.currentUser,
        oldPayload: { ...oldPayload },
        payload: { ...room },
      });
    }
    return RoomResponse.fromEntity(room);
  }
  async archiveRoom(archiveCommand: ArchiveRoomCommand): Promise<RoomResponse> {
    const roomDomain = await this.roomRepository.getById(archiveCommand.id);
    if (!roomDomain) {
      throw new NotFoundException(
        `Room not found with id ${archiveCommand.id}`,
      );
    }

    roomDomain.deletedAt = new Date();
    roomDomain.deletedBy = archiveCommand.currentUser.id;
    roomDomain.archiveReason = archiveCommand.reason;
    const result = await this.roomRepository.update(roomDomain.id, roomDomain);
    if (result) {
      this.eventEmitter.emit('activity-logger.store', {
        modelId: archiveCommand.id,
        modelName: MODELS.ROOM,
        action: ACTIONS.ARCHIVE,
        userId: archiveCommand.currentUser.id,
        user: archiveCommand.currentUser,
      });
    }
    return RoomResponse.fromEntity(result);
  }
  async restoreRoom(id: string, currentUser: UserInfo): Promise<RoomResponse> {
    const roomDomain = await this.roomRepository.getById(id, [], true);
    if (!roomDomain) {
      throw new NotFoundException(`Room not found with id ${id}`);
    }
    const r = await this.roomRepository.restore(id);
    if (r) {
      roomDomain.deletedAt = null;
      this.eventEmitter.emit('activity-logger.store', {
        modelId: id,
        modelName: MODELS.ROOM,
        action: ACTIONS.RESTORE,
        userId: currentUser.id,
        user: currentUser,
      });
    }
    return RoomResponse.fromEntity(roomDomain);
  }
  async deleteRoom(id: string, currentUser: UserInfo): Promise<boolean> {
    const roomDomain = await this.roomRepository.getById(id, [], true);
    if (!roomDomain) {
      throw new NotFoundException(`Room not found with id ${id}`);
    }

    const result = await this.roomRepository.delete(id);
    if (result) {
      if (roomDomain.roomImage) {
        await this.fileManagerService.removeFile(
          roomDomain.roomImage,
          FileManagerHelper.UPLOADED_FILES_DESTINATION,
        );
      }

      this.eventEmitter.emit('activity-logger.store', {
        modelId: id,
        modelName: MODELS.ROOM,
        action: ACTIONS.DELETE,
        userId: currentUser.id,
        user: currentUser,
      });
    }
    return result;
  }
  async activateOrBlockRoom(
    id: string,
    currentUser: UserInfo,
  ): Promise<RoomResponse> {
    const roomDomain = await this.roomRepository.getById(id);
    if (!roomDomain) {
      throw new NotFoundException(`Room not found with id ${id}`);
    }
    roomDomain.enabled = !roomDomain.enabled;
    const result = await this.roomRepository.update(roomDomain.id, roomDomain);
    if (result) {
      this.eventEmitter.emit('activity-logger.store', {
        modelId: id,
        modelName: MODELS.ROOM,
        action: roomDomain.status ? ACTIONS.ACTIVATE : ACTIONS.BLOCK,
        userId: currentUser.id,
        user: currentUser,
      });
    }
    return RoomResponse.fromEntity(result);
  }
  async updateRoomImage(id: string, fileDto: FileResponseDto) {
    const roomDomain = await this.roomRepository.getById(id);
    if (!roomDomain) {
      throw new NotFoundException(`Kid not found with id ${id}`);
    }
    if (roomDomain.roomImage && fileDto) {
      await this.fileManagerService.removeFile(
        roomDomain.roomImage,
        FileManagerHelper.UPLOADED_FILES_DESTINATION,
      );
    }
    roomDomain.roomImage = fileDto as FileDto;
    const result = await this.roomRepository.update(roomDomain.id, roomDomain);

    return RoomResponse.fromEntity(result);
  }
}
