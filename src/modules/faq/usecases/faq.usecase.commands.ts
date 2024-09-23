import { ACTIONS, MODELS } from '@libs/common/constants';
import { UserInfo } from '@account/dtos/user-info.dto';
import {
  FileManagerHelper,
  FileManagerService,
} from '@libs/common/file-manager';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FaqRepository } from '../persistence/faq.repository';
import {
  ArchiveFaqCommand,
  CreateFaqCommand,
  UpdateFaqCommand,
} from './faq.commands';
import { FaqResponse } from './faq.response';

@Injectable()
export class FaqCommands {
  constructor(
    private faqRepository: FaqRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly fileManagerService: FileManagerService,
  ) {}
  async createFaq(command: CreateFaqCommand): Promise<FaqResponse> {
    const faqDomain = CreateFaqCommand.fromCommand(command);
    const faq = await this.faqRepository.insert(faqDomain);
    if (faq) {
      this.eventEmitter.emit('activity-logger.store', {
        modelId: faq.id,
        modelName: MODELS.FAQ,
        action: ACTIONS.CREATE,
        user: command.currentUser,
        userId: command.currentUser.id,
      });
    }
    return FaqResponse.fromDomain(faq);
  }
  async updateFaq(command: UpdateFaqCommand): Promise<FaqResponse> {
    const faqDomain = await this.faqRepository.getFaqById(command.id);
    if (!faqDomain) {
      throw new NotFoundException(`Faq not found with id ${command.id}`);
    }
    // if (newsDomain.coverImage && command.coverImage) {
    //   await this.fileManagerService.removeFile(
    //     newsDomain.coverImage,
    //     FileManagerHelper.UPLOADED_FILES_DESTINATION,
    //   );
    // }
    const oldPayload = { ...faqDomain };
    faqDomain.title = command.title;
    faqDomain.description = command.description;
    faqDomain.tags = command.tags;
    // if (
    //   command.coverImage &&
    //   command.coverImage?.filename !== newsDomain.coverImage?.filename
    // ) {
    //   newsDomain.coverImage = command.coverImage;
    // }
    const faq = await this.faqRepository.update(faqDomain);
    if (faq) {
      this.eventEmitter.emit('activity-logger.store', {
        modelId: faq.id,
        modelName: MODELS.FAQ,
        action: ACTIONS.UPDATE,
        userId: command.currentUser.id,
        user: command.currentUser,
        payload: { ...faq },
        oldPayload: { ...oldPayload },
      });
    }
    return FaqResponse.fromDomain(faq);
  }
  async deleteFaq(id: string, currentUser: UserInfo): Promise<boolean> {
    const faqDomain = await this.faqRepository.getFaqById(id, true);
    if (!faqDomain) {
      throw new NotFoundException(`Faq not found with id ${id}`);
    }
    this.eventEmitter.emit('activity-logger.store', {
      modelId: id,
      modelName: MODELS.FAQ,
      action: ACTIONS.DELETE,
      userId: currentUser.id,
      user: currentUser,
    });
    // if (newsDomain.coverImage) {
    //   await this.fileManagerService.removeFile(
    //     newsDomain.coverImage,
    //     FileManagerHelper.UPLOADED_FILES_DESTINATION,
    //   );
    // }
    return await this.faqRepository.delete(id);
  }
  async archiveFaq(command: ArchiveFaqCommand): Promise<FaqResponse> {
    const faqDomain = await this.faqRepository.getFaqById(command.id);
    if (!faqDomain) {
      throw new NotFoundException(`Faq not found with id ${command.id}`);
    }
    faqDomain.deletedAt = new Date();
    faqDomain.deletedBy = command.currentUser.id;
    faqDomain.archiveReason = command.reason;
    const result = await this.faqRepository.update(faqDomain);
    if (result) {
      this.eventEmitter.emit('activity-logger.store', {
        modelId: command.id,
        modelName: MODELS.FAQ,
        action: ACTIONS.ARCHIVE,
        userId: command.currentUser.id,
        user: command.currentUser,
      });
    }
    return FaqResponse.fromDomain(result);
  }
  async restoreFaq(id: string, currentUser: UserInfo): Promise<FaqResponse> {
    const faqDomain = await this.faqRepository.getFaqById(id, true);
    if (!faqDomain) {
      throw new NotFoundException(`Faq not found with id ${id}`);
    }
    const r = await this.faqRepository.restore(id);
    if (r) {
      faqDomain.deletedAt = null;
      faqDomain.deletedBy = null;
      faqDomain.archiveReason = null;
    }
    this.eventEmitter.emit('activity-logger.store', {
      modelId: id,
      modelName: MODELS.FAQ,
      action: ACTIONS.RESTORE,
      userId: currentUser.id,
      user: currentUser,
    });
    return FaqResponse.fromDomain(faqDomain);
  }
}
