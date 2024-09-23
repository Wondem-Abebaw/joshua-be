import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFaqRepository } from '../domains/faq.repository.interface';
import { FaqEntity } from './faq.entity';
import { Faq } from '../domains/faq';

@Injectable()
export class FaqRepository implements IFaqRepository {
  constructor(
    @InjectRepository(FaqEntity)
    private faqRepository: Repository<FaqEntity>,
  ) {}
  async insert(faq: Faq): Promise<Faq> {
    const faqEntity = this.toFaqEntity(faq);
    const result = await this.faqRepository.save(faqEntity);
    return result ? this.toFaq(result) : null;
  }
  async update(faq: Faq): Promise<Faq> {
    const faqEntity = this.toFaqEntity(faq);
    const result = await this.faqRepository.save(faqEntity);
    return result ? this.toFaq(result) : null;
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.faqRepository.delete({ id: id });
    if (result.affected > 0) return true;
    return false;
  }
  async archive(id: string): Promise<boolean> {
    const result = await this.faqRepository.softDelete(id);
    if (result.affected > 0) return true;
    return false;
  }
  async restore(id: string): Promise<boolean> {
    const result = await this.faqRepository.restore(id);
    if (result.affected > 0) return true;
    return false;
  }
  async getAllFaqs(withDeleted: boolean): Promise<Faq[]> {
    const allFaq = await this.faqRepository.find({
      relations: [],
      withDeleted: withDeleted,
    });
    if (!allFaq.length) {
      return null;
    }
    return allFaq.map((faq) => this.toFaq(faq));
  }
  async getFaqById(id: string, withDeleted = false): Promise<Faq> {
    const faq = await this.faqRepository.find({
      where: { id: id },
      relations: [],
      withDeleted: withDeleted,
    });
    if (!faq[0]) {
      return null;
    }
    return this.toFaq(faq[0]);
  }
  toFaq(faqEntity: FaqEntity): Faq {
    const faq = new Faq();
    faq.id = faqEntity.id;
    faq.title = faqEntity.title;
    faq.description = faqEntity.description;
    faq.tags = faqEntity.tags;
    // news.coverImage = newsEntity.coverImage;
    faq.archiveReason = faqEntity.archiveReason;
    faq.createdBy = faqEntity.createdBy;
    faq.updatedBy = faqEntity.updatedBy;
    faq.deletedBy = faqEntity.deletedBy;
    faq.createdAt = faqEntity.createdAt;
    faq.updatedAt = faqEntity.updatedAt;
    faq.deletedAt = faqEntity.deletedAt;
    return faq;
  }
  toFaqEntity(faq: Faq): FaqEntity {
    const faqEntity = new FaqEntity();
    faqEntity.id = faq.id;
    faqEntity.title = faq.title;
    faqEntity.description = faq.description;
    faqEntity.tags = faq.tags;
    // newsEntity.coverImage = news.coverImage;
    faqEntity.archiveReason = faq.archiveReason;
    faqEntity.createdBy = faq.createdBy;
    faqEntity.updatedBy = faq.updatedBy;
    faqEntity.deletedBy = faq.deletedBy;
    faqEntity.createdAt = faq.createdAt;
    faqEntity.updatedAt = faq.updatedAt;
    faqEntity.deletedAt = faq.deletedAt;
    return faqEntity;
  }
}
