import { FileManagerService } from '@libs/common/file-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationsController } from './controllers/configurations.controller';
import { ConfigurationEntity } from './persistence/configuration/configuration.entity';
import { ConfigurationRepository } from './persistence/configuration/configuration.repository';
import { ConfigurationCommands } from './usecases/configuration/configuration.usecase.commands';
import { ConfigurationQuery } from './usecases/configuration/configuration.usecase.queries';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigurationEntity])],
  providers: [
    FileManagerService,
    ConfigurationRepository,
    ConfigurationCommands,
    ConfigurationQuery,
  ],
  exports: [ConfigurationRepository],
  controllers: [ConfigurationsController],
})
export class ConfigurationsModule {}
