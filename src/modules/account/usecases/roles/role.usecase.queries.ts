import { CollectionQuery } from '@libs/collection-query/collection-query';
import { QueryConstructor } from '@libs/collection-query/query-constructor';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperators } from '@libs/collection-query/filter_operators';
import { RoleEntity } from '@account/persistence/roles/role.entity';
import { RoleResponse } from './role.response';
import { RolePermissionResponse } from './role-permission.response';
import { RolePermissionEntity } from '@account/persistence/roles/role-permission.entity';
import { PermissionResponse } from '../permissions/permission.response';
import { PermissionEntity } from '@account/persistence/permissions/permission.entity';
@Injectable()
export class RoleQueries {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private rolePermissionRepository: Repository<RolePermissionEntity>,
  ) {}
  async getRole(id: string, withDeleted = false): Promise<RoleResponse> {
    const role = await this.roleRepository.find({
      where: { id: id },
      relations: [],

      withDeleted: withDeleted,
    });
    if (!role[0]) {
      throw new NotFoundException(`Role not found with id ${id}`);
    }
    return RoleResponse.fromEntity(role[0]);
  }
  async getRoles(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RoleResponse>> {
    const dataQuery = QueryConstructor.constructQuery<RoleEntity>(
      this.roleRepository,
      query,
    );
    const d = new DataResponseFormat<RoleResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => RoleResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async getArchivedRoles(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RoleResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<RoleEntity>(
      this.roleRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<RoleResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => RoleResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async getRolePermissions(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RolePermissionResponse>> {
    const dataQuery = QueryConstructor.constructQuery<RolePermissionEntity>(
      this.rolePermissionRepository,
      query,
    );
    const d = new DataResponseFormat<RolePermissionResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) =>
        RolePermissionResponse.fromEntity(entity),
      );
      d.count = total;
    }
    return d;
  }
  async getRolePermission(id: string): Promise<RolePermissionResponse> {
    const rolePermission = await this.rolePermissionRepository.find({
      where: { id: id },
    });
    if (!rolePermission[0]) {
      throw new NotFoundException(`Role permission not found with id ${id}`);
    }
    return RolePermissionResponse.fromEntity(rolePermission[0]);
  }
  async getArchivedRolePermissions(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RolePermissionResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<RolePermissionEntity>(
      this.rolePermissionRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<RolePermissionResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) =>
        RolePermissionResponse.fromEntity(entity),
      );
      d.count = total;
    }
    return d;
  }
  async getPermissionsByRoleId(
    roleId: string,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PermissionResponse>> {
    const dataQuery = QueryConstructor.constructQuery<PermissionEntity>(
      this.permissionRepository,
      query,
    )
      .innerJoin('permissions.rolePermissions', 'rolePermissions')
      .andWhere('rolePermissions.role_id = :q', {
        q: roleId,
      })
      .distinct(true);
    //console.log(dataQuery.getSql(), dataQuery.getParameters());
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
