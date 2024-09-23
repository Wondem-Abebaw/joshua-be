import { CollectionQuery } from '@libs/collection-query/collection-query';
import { QueryConstructor } from '@libs/collection-query/query-constructor';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperators } from '@libs/collection-query/filter_operators';
import { PermissionEntity } from '@account/persistence/permissions/permission.entity';
import { PermissionResponse } from './permission.response';
@Injectable()
export class PermissionQueries {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}
  async getPermission(
    id: string,
    withDeleted = false,
  ): Promise<PermissionResponse> {
    const permission = await this.permissionRepository.find({
      where: { id: id },
      relations: [],

      withDeleted: withDeleted,
    });
    if (!permission[0]) {
      throw new NotFoundException(`Permission not found with id ${id}`);
    }
    return PermissionResponse.fromEntity(permission[0]);
  }
  async getPermissions(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PermissionResponse>> {
    const dataQuery = QueryConstructor.constructQuery<PermissionEntity>(
      this.permissionRepository,
      query,
    );
    const d = new DataResponseFormat<PermissionResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => PermissionResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async getArchivedPermissions(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PermissionResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<PermissionEntity>(
      this.permissionRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<PermissionResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => PermissionResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
}
