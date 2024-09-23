import { UserInfo } from '@account/dtos/user-info.dto';
import { ConfigurationEntity } from '@configurations/persistence/configuration/configuration.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GlobalConfigurations {
  @ApiProperty()
  @IsNotEmpty()
  timeout: number = 30;
  @ApiProperty()
  @IsNotEmpty()
  employeeRegistrationFee: number = 50;
  @ApiProperty()
  @IsNotEmpty()
  employerRegistrationFeeOne: number = 150;
  @ApiProperty()
  @IsNotEmpty()
  employerRegistrationFeeThree: number = 200;
  @ApiProperty()
  @IsNotEmpty()
  employerRegistrationFeeSix: number = 250;
  @ApiProperty()
  @IsNotEmpty()
  employerRegistrationFeeTwelve: number = 300;
  @ApiProperty()
  @IsNotEmpty()
  employeePlanDuration: number = 365;
  @ApiProperty()
  @IsNotEmpty()
  isBeingMaintained: boolean = false;
  @ApiProperty()
  @IsNotEmpty()
  telebirrStatus: boolean = true;
  @ApiProperty()
  @IsNotEmpty()
  chapaStatus: boolean = true;
}

export class CreateConfigurationCommand {
  @ApiProperty()
  @IsNotEmpty()
  globalConfigurations: GlobalConfigurations;
  currentUser: UserInfo;
  static fromCommand(command: CreateConfigurationCommand): ConfigurationEntity {
    const configuration = new ConfigurationEntity();
    configuration.globalConfigurations = command.globalConfigurations;
    return configuration;
  }
}
export class UpdateConfigurationCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  globalConfigurations: GlobalConfigurations;
  currentUser: UserInfo;
  static fromCommand(command: UpdateConfigurationCommand): ConfigurationEntity {
    const configuration = new ConfigurationEntity();
    configuration.id = command.id;
    configuration.globalConfigurations = command.globalConfigurations;
    return configuration;
  }
}
export class ArchiveConfigurationCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
