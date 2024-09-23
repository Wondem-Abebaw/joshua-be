import { ConfigurationEntity } from '@configurations/persistence/configuration/configuration.entity';
import { CollectionQuery } from '@libs/collection-query/collection-query';
import { FilterOperators } from '@libs/collection-query/filter_operators';
import { QueryConstructor } from '@libs/collection-query/query-constructor';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigurationResponse } from './configuration.response';

@Injectable()
export class ConfigurationQuery {
  constructor(
    @InjectRepository(ConfigurationEntity)
    private configurationRepository: Repository<ConfigurationEntity>,
  ) {}
  async getConfiguration(
    id: string,
    relations = [],
  ): Promise<ConfigurationResponse> {
    const configuration = await this.configurationRepository.findOne({
      where: { id: id },
      relations,
    });
    if (!configuration) {
      throw new NotFoundException(`Advert not found with id ${id}`);
    }
    return ConfigurationResponse.fromEntity(configuration);
  }
  async getConfigurations(
    query: CollectionQuery,
  ): Promise<ConfigurationResponse> {
    const dataQuery = QueryConstructor.constructQuery<ConfigurationEntity>(
      this.configurationRepository,
      query,
    );
    const result = await dataQuery.getOne();
    return result;
  }
  async getArchivedConfigurations(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<ConfigurationResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<ConfigurationEntity>(
      this.configurationRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<ConfigurationResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => ConfigurationResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
}
