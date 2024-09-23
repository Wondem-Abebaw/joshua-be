import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { IBaseRepository } from '../interfaces/base.repository.interface';

export abstract class BaseRepository<T extends BaseEntity>
  implements IBaseRepository<T>
{
  constructor(private readonly repository: Repository<T>) {}

  async getAll(relations = [], withDeleted = false): Promise<T[]> {
    return this.repository.find({
      withDeleted,
      relations,
    });
  }

  async getById(id: string, relations = [], withDeleted = false): Promise<T> {
    const findOptions: FindOneOptions<T> = {
      where: {
        id: id,
      } as FindOptionsWhere<T>,
      relations,
      withDeleted,
    };

    return await this.repository.findOne(findOptions);
  }
  async insert(data: T): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async update(id: string, data: Partial<any>): Promise<T> {
    await this.repository.update(id, data);
    return await this.getById(id, [], true);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0 ? true : false;
  }
  async restore(id: string): Promise<boolean> {
    const result = await this.repository.restore(id);
    return result.affected > 0 ? true : false;
  }
  async archive(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected > 0 ? true : false;
  }
  async getOneBy(
    field: string,
    value: any,
    relations = [],
    withDeleted = false,
  ): Promise<T> {
    const option = {};
    option[field] = value;
    return await this.repository.findOne({
      where: option,
      relations,
      withDeleted,
    });
  }
  async getAllBy(
    field: string,
    value: any,
    relations = [],
    withDeleted = false,
  ): Promise<T[]> {
    const option = {};
    option[field] = value;
    return await this.repository.find({
      where: option,
      relations,
      withDeleted,
    });
  }
  async save(itemData: DeepPartial<T>): Promise<T> {
    return await this.repository.save(itemData);
  }
}
