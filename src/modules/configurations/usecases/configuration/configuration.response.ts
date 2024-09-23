import { ConfigurationEntity } from '@configurations/persistence/configuration/configuration.entity';
import { ApiProperty } from '@nestjs/swagger';
import { GlobalConfigurations } from './configuration.commands';

export class ConfigurationResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  globalConfigurations: GlobalConfigurations;
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
  static fromEntity(
    configurationEntity: ConfigurationEntity,
  ): ConfigurationResponse {
    const configurationResponse = new ConfigurationResponse();
    configurationResponse.id = configurationEntity.id;
    configurationResponse.globalConfigurations =
      configurationEntity.globalConfigurations;
    configurationResponse.createdBy = configurationEntity.createdBy;
    configurationResponse.updatedBy = configurationEntity.updatedBy;
    configurationResponse.deletedBy = configurationEntity.deletedBy;
    configurationResponse.createdAt = configurationEntity.createdAt;
    configurationResponse.updatedAt = configurationEntity.updatedAt;
    configurationResponse.deletedAt = configurationEntity.deletedAt;
    return configurationResponse;
  }
  // static fromDomain(configuration: Configuration): ConfigurationResponse {
  //   const configurationResponse = new ConfigurationResponse();
  //   configurationResponse.id = configuration.id;
  //   configurationResponse.globalConfigurations =
  //     configuration.globalConfigurations;
  //   configurationResponse.createdBy = configuration.createdBy;
  //   configurationResponse.updatedBy = configuration.updatedBy;
  //   configurationResponse.deletedBy = configuration.deletedBy;
  //   configurationResponse.createdAt = configuration.createdAt;
  //   configurationResponse.updatedAt = configuration.updatedAt;
  //   configurationResponse.deletedAt = configuration.deletedAt;
  //   return configurationResponse;
  // }
}
