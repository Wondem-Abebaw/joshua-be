import { CollectionQuery } from '@libs/collection-query/collection-query';
import { FilterOperators } from '@libs/collection-query/filter_operators';
import { QueryConstructor } from '@libs/collection-query/query-constructor';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FaqEntity } from '../persistence/faq.entity';
import { Repository } from 'typeorm';
import { FaqResponse } from './faq.response';

@Injectable()
export class FaqQuery {
  constructor(
    @InjectRepository(FaqEntity)
    private faqRepository: Repository<FaqEntity>,
  ) {}
  async getAllFaq(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<FaqResponse>> {
    const dataQuery = QueryConstructor.constructQuery<FaqEntity>(
      this.faqRepository,
      query,
    );
    const d = new DataResponseFormat<FaqResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => FaqResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async getArchivedFaqById(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<FaqResponse> {
    const faq = await this.faqRepository.findOne({
      where: { id: id },
      relations,
      withDeleted: withDeleted,
    });
    if (!faq) {
      throw new NotFoundException(`Faq not found with id ${id}`);
    }
    return FaqResponse.fromEntity(faq);
  }
  async getFaqById(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<FaqResponse> {
    const faq = await this.faqRepository.findOne({
      where: { id: id },
      relations,
      withDeleted: withDeleted,
    });
    if (!faq) {
      throw new NotFoundException(`Faq not found with id ${id}`);
    }
    return FaqResponse.fromEntity(faq);
  }
  async getArchivedFaq(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<FaqResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<FaqEntity>(
      this.faqRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<FaqResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => FaqResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
}
