import { FileDto } from '@libs/common/file-dto';
import { ApiProperty } from '@nestjs/swagger';
import { FaqEntity } from '../persistence/faq.entity';
import { Faq } from '../domains/faq';

export class FaqResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  tags: string[];
  //   @ApiProperty()
  //   coverImage: FileDto;
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
  static fromEntity(faqEntity: FaqEntity): FaqResponse {
    const faqResponse = new FaqResponse();
    faqResponse.id = faqEntity.id;
    faqResponse.title = faqEntity.title;
    faqResponse.description = faqEntity.description;
    faqResponse.tags = faqEntity.tags;
    // newsResponse.coverImage = faqEntity.coverImage;
    faqResponse.archiveReason = faqEntity.archiveReason;
    faqResponse.createdBy = faqEntity.createdBy;
    faqResponse.updatedBy = faqEntity.updatedBy;
    faqResponse.deletedBy = faqEntity.deletedBy;
    faqResponse.createdAt = faqEntity.createdAt;
    faqResponse.updatedAt = faqEntity.updatedAt;
    faqResponse.deletedAt = faqEntity.deletedAt;
    return faqResponse;
  }
  static fromDomain(faq: Faq): FaqResponse {
    const faqResponse = new FaqResponse();
    faqResponse.id = faq.id;
    faqResponse.title = faq.title;
    faqResponse.description = faq.description;
    faqResponse.tags = faq.tags;
    // faqResponse.coverImage = faq.coverImage;
    faqResponse.archiveReason = faq.archiveReason;
    faqResponse.createdBy = faq.createdBy;
    faqResponse.updatedBy = faq.updatedBy;
    faqResponse.deletedBy = faq.deletedBy;
    faqResponse.createdAt = faq.createdAt;
    faqResponse.updatedAt = faq.updatedAt;
    faqResponse.deletedAt = faq.deletedAt;
    return faqResponse;
  }
}
