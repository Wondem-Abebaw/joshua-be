import { GlobalConfigurations } from '@configurations/usecases/configuration/configuration.commands';
import { BaseEntity } from '@libs/common/entities/base.entity';
import { Column, Double, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('configurations')
export class ConfigurationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'jsonb', name: 'global_configurations' })
  globalConfigurations: GlobalConfigurations;
}
