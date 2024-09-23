import { CollectionQuery } from '@libs/collection-query/collection-query';
import { FilterOperators } from '@libs/collection-query/filter_operators';
import { QueryConstructor } from '@libs/collection-query/query-constructor';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '@account/persistence/accounts/account.entity';
import { Repository } from 'typeorm';
import { AccountResponse } from './account.response';
import { AccountRoleResponse } from './account-role.response';
import { AccountRoleEntity } from '@account/persistence/accounts/account-role.entity';
import { AccountPermissionEntity } from '@account/persistence/accounts/account-permission.entity';
import { AccountPermissionResponse } from './account-permission.response';
import { RoleResponse } from '../roles/role.response';
import { RoleEntity } from '@account/persistence/roles/role.entity';
import { PermissionResponse } from '../permissions/permission.response';
import { PermissionEntity } from '@account/persistence/permissions/permission.entity';
@Injectable()
export class AccountQuery {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(AccountRoleEntity)
    private accountRoleRepository: Repository<AccountRoleEntity>,
    @InjectRepository(AccountPermissionEntity)
    private accountPermissionRepository: Repository<AccountPermissionEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}
  async getAccount(id: string): Promise<AccountResponse> {
    const account = await this.accountRepository.find({
      where: { id: id },
      relations: [],
    });
    if (!account[0]) {
      throw new NotFoundException(`Account not found with id ${id}`);
    }
    return AccountResponse.fromEntity(account[0]);
  }
  async checkAccount(phoneNumber: string, type: string): Promise<boolean> {
    const account = await this.accountRepository.find({
      where: { phoneNumber: phoneNumber, type: type },
      relations: [],
    });
    if (!account[0]) {
      return false;
    }
    return true;
  }
  async getAccounts(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<AccountResponse>> {
    const dataQuery = QueryConstructor.constructQuery<AccountEntity>(
      this.accountRepository,
      query,
    );
    const d = new DataResponseFormat<AccountResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => AccountResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async getArchivedAccounts(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<AccountResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<AccountEntity>(
      this.accountRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<AccountResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => AccountResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async getAccountRoles(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<AccountRoleResponse>> {
    const dataQuery = QueryConstructor.constructQuery<AccountRoleEntity>(
      this.accountRoleRepository,
      query,
    );
    const d = new DataResponseFormat<AccountRoleResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => AccountRoleResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  async getAccountRole(id: string): Promise<AccountRoleResponse> {
    const accountRole = await this.accountRoleRepository.find({
      where: { id: id },
    });
    if (!accountRole[0]) {
      throw new NotFoundException(`Account role not found with id ${id}`);
    }
    return AccountRoleResponse.fromEntity(accountRole[0]);
  }
  async getArchivedAccountRoles(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<AccountRoleResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<AccountRoleEntity>(
      this.accountRoleRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<AccountRoleResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => AccountRoleResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
  //Account Permission
  async getAccountPermissions(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<AccountPermissionResponse>> {
    const dataQuery = QueryConstructor.constructQuery<AccountPermissionEntity>(
      this.accountPermissionRepository,
      query,
    );
    const d = new DataResponseFormat<AccountPermissionResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) =>
        AccountPermissionResponse.fromEntity(entity),
      );
      d.count = total;
    }
    return d;
  }
  async getAccountPermission(id: string): Promise<AccountPermissionResponse> {
    const accountPermission = await this.accountPermissionRepository.find({
      where: { id: id },
    });
    if (!accountPermission[0]) {
      throw new NotFoundException(`Account permission not found with id ${id}`);
    }
    return AccountPermissionResponse.fromEntity(accountPermission[0]);
  }
  async getArchivedAccountPermissions(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<AccountPermissionResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<AccountPermissionEntity>(
      this.accountPermissionRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<AccountPermissionResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) =>
        AccountPermissionResponse.fromEntity(entity),
      );
      d.count = total;
    }
    return d;
  }
  async getRolesByAccountId(
    accountId: string,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RoleResponse>> {
    const dataQuery = QueryConstructor.constructQuery<RoleEntity>(
      this.roleRepository,
      query,
    )
      .innerJoin('roles.accountRoles', 'accountRoles')
      .andWhere('accountRoles.account_id = :q', {
        q: accountId,
      })
      .distinct(true);
    //console.log(dataQuery.getSql(), dataQuery.getParameters());
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
  async getRoles(
    accountId: string,
    query: CollectionQuery,
  ): Promise<RoleResponse[]> {
    const dataQuery = QueryConstructor.constructQuery<RoleEntity>(
      this.roleRepository,
      query,
    )
      .innerJoin('roles.accountRoles', 'accountRoles')
      .andWhere('accountRoles.account_id = :q', {
        q: accountId,
      })
      .distinct(true);
    //console.log(dataQuery.getSql(), dataQuery.getParameters());
    const result = await dataQuery.getMany();
    return result.map((entity) => RoleResponse.fromEntity(entity));
  }
  async getPermissionsByAccountId(
    accountId: string,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PermissionResponse>> {
    const dataQuery = QueryConstructor.constructQuery<PermissionEntity>(
      this.permissionRepository,
      query,
    )
      .innerJoin('permissions.accountPermissions', 'accountPermissions')
      .andWhere('accountPermissions.account_id = :q', {
        q: accountId,
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
  async getPermissionsByAccountIdAndRoleId(
    accountId: string,
    roleId: string,
    query: CollectionQuery,
  ): Promise<PermissionResponse[]> {
    const dataQuery = QueryConstructor.constructQuery<PermissionEntity>(
      this.permissionRepository,
      query,
    )
      .innerJoin('permissions.accountPermissions', 'accountPermissions')
      .andWhere('accountPermissions.account_id = :q', {
        q: accountId,
      })
      .andWhere('accountPermissions.role_id = :r', {
        r: roleId,
      })
      .distinct(true);
    const result = await dataQuery.getMany();
    return result.map((entity) => PermissionResponse.fromEntity(entity));
  }
  async getPermissionsByAccountI(
    accountId: string,
    roleId: string,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PermissionResponse>> {
    const dataQuery = QueryConstructor.constructQuery<PermissionEntity>(
      this.permissionRepository,
      query,
    )
      .innerJoin('permissions.accountPermissions', 'accountPermissions')
      .andWhere('accountPermissions.account_id = :q', {
        q: accountId,
      })
      .andWhere('accountPermissions.role_id = :r', {
        r: roleId,
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
  async getAllForNotification(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<AccountResponse>> {
    const dataQuery = QueryConstructor.constructQuery<AccountEntity>(
      this.accountRepository,
      query,
    );
    const d = new DataResponseFormat<AccountResponse>();
    if (query.count) {
      d.count = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => AccountResponse.fromEntity(entity));
      d.count = total;
    }
    return d;
  }
}
