import { ACTIONS, MODELS } from '@libs/common/constants';
import { ConfigurationRepository } from '@configurations/persistence/configuration/configuration.repository';
import { FileManagerService } from '@libs/common/file-manager';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ArchiveConfigurationCommand,
  CreateConfigurationCommand,
  UpdateConfigurationCommand,
} from './configuration.commands';
import { ConfigurationResponse } from './configuration.response';

@Injectable()
export class ConfigurationCommands implements OnModuleInit {
  constructor(
    private configurationRepository: ConfigurationRepository,
    private eventEmitter: EventEmitter2,
    private readonly fileManagerService: FileManagerService,
  ) {}
  onModuleInit() {
    this.seedConfiguration();
  }
  async seedConfiguration(): Promise<void> {
    const existingConfigurations = await this.configurationRepository.getAll(
      [],
      false,
    );
    if (!existingConfigurations || existingConfigurations.length <= 0) {
      const globalConfigurations = {
        timeout: 30,
        isBeingMaintained: false,
        telebirrStatus: true,
        chapaStatus: true,
        employeeRegistrationFee: 50,
        employeePlanDuration: 365,
        employerRegistrationFeeOne: 150,
        employerRegistrationFeeThree: 200,
        employerRegistrationFeeSix: 250,
        employerRegistrationFeeTwelve: 300,
      };
      const configCommand = new CreateConfigurationCommand();
      configCommand.globalConfigurations = globalConfigurations;
      this.createConfiguration(configCommand);
    }
  }
  async createConfiguration(
    command: CreateConfigurationCommand,
  ): Promise<ConfigurationResponse> {
    const configurationDomain = CreateConfigurationCommand.fromCommand(command);
    const configuration = await this.configurationRepository.insert(
      configurationDomain,
    );
    return ConfigurationResponse.fromEntity(configuration);
  }
  async updateConfiguration(
    command: UpdateConfigurationCommand,
  ): Promise<ConfigurationResponse> {
    const configurationDomain = await this.configurationRepository.getById(
      command.id,
    );
    if (!configurationDomain) {
      throw new NotFoundException(
        `Configuration not found with id ${command.id}`,
      );
    }
    const oldPayload = configurationDomain;
    configurationDomain.globalConfigurations = command.globalConfigurations;
    configurationDomain.updatedBy = command.currentUser.id;
    const configuration = await this.configurationRepository.update(
      command.id,
      configurationDomain,
    );
    if (configuration) {
      this.eventEmitter.emit('activity-logger.store', {
        modelId: configuration.id,
        modelName: MODELS.CONFIGURATION,
        action: ACTIONS.UPDATE,
        userId: command.currentUser.id,
        user: command.currentUser,
        payload: configuration,
        oldPayload: oldPayload,
      });
    }
    return ConfigurationResponse.fromEntity(configuration);
  }
  async archiveConfiguration(
    command: ArchiveConfigurationCommand,
  ): Promise<boolean> {
    const configurationDomain = await this.configurationRepository.getById(
      command.id,
    );
    if (!configurationDomain) {
      throw new NotFoundException(
        `Configuration not found with id ${command.id}`,
      );
    }
    configurationDomain.deletedAt = new Date();
    configurationDomain.deletedBy = command.currentUser.id;
    configurationDomain.archiveReason = command.reason;
    const result = await this.configurationRepository.update(
      command.id,
      configurationDomain,
    );
    return result ? true : false;
  }
  async restoreConfiguration(id: string): Promise<ConfigurationResponse> {
    const configurationDomain = await this.configurationRepository.getById(
      id,
      [],
      true,
    );
    if (!configurationDomain) {
      throw new NotFoundException(`Configuration not found with id ${id}`);
    }
    const r = await this.configurationRepository.restore(id);
    if (r) {
      configurationDomain.deletedAt = null;
    }
    return ConfigurationResponse.fromEntity(configurationDomain);
  }
  async deleteConfiguration(id: string): Promise<boolean> {
    const configurationDomain = await this.configurationRepository.getById(
      id,
      [],
      true,
    );
    if (!configurationDomain) {
      throw new NotFoundException(`Configuration not found with id ${id}`);
    }
    return await this.configurationRepository.delete(id);
  }
}
