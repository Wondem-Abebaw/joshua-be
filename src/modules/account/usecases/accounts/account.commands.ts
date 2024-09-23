import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Account } from '@account/domains/accounts/account';
import { FileDto } from '@libs/common/file-dto';
import { Address } from '@libs/common/address';
export class CreateAccountCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: 'someone@gmail.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: '+251911111111',
  })
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  type: string;
  @ApiProperty()
  @IsNotEmpty()
  role?: string[];
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  gender?: string;
  @ApiProperty()
  address?: Address;
  @ApiProperty()
  profileImage?: FileDto;
  @ApiProperty()
  planTypeId?: string;
  accountId: string;
  isActive: boolean;
  verified: boolean;
  notifyMe: boolean;
  isPaid: boolean;
  static fromCommand(command: CreateAccountCommand): Account {
    const accountDomain = new Account();
    accountDomain.name = command.name;
    accountDomain.email = command.email;
    accountDomain.phoneNumber = command.phoneNumber;
    accountDomain.id = command.accountId;
    accountDomain.type = command.type.toLowerCase();
    accountDomain.isActive = command.isActive;
    accountDomain.password = command.password;
    accountDomain.gender = command.gender;
    accountDomain.address = command.address;
    accountDomain.profileImage = command.profileImage;
    accountDomain.planTypeId = command.planTypeId;
    accountDomain.username = `${command.type.toLowerCase()}_${
      command.phoneNumber
    }`;
    return accountDomain;
  }
}
export class UpdateAccountCommand {
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  gender?: string;
  @ApiProperty()
  address?: Address;
  @ApiProperty()
  profileImage?: FileDto;
  @ApiProperty()
  planTypeId: string;
  @ApiProperty()
  planTypeDuration: number;
  // @ApiProperty()
  // numberOfJobPosts: number;
  // @ApiProperty()
  // numberOfRequests: number;
  verified: boolean;
  notifyMe: boolean;
  isPaid: boolean;
}
export class ChangeOnlineStatusCommand {
  @ApiProperty()
  id: string;
  @ApiProperty()
  isOnline: boolean;
}
export class UpgradePlanCommands {
  @ApiProperty()
  id: string;
  @ApiProperty()
  planTypeId: string;
  @ApiProperty()
  @IsNotEmpty()
  planTypeDuration: number;
  // @ApiProperty()
  // numberOfJobPosts: number;
}
export class UpgradeEmployeePlanCommands {
  @ApiProperty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  planTypeId: string;
  @ApiProperty()
  @IsNotEmpty()
  planTypeDuration: number;
}
