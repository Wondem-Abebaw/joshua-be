import { UserInfo } from '@account/dtos/user-info.dto';
import { Address } from '@libs/common/address';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Gender } from '@libs/common/enums';
import { EmergencyContact } from '@libs/common/emergency-contact';
import { UserEntity } from '@user/persistence/users/user.entity';

export class CreateUserCommand {
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
  @ApiProperty({
    enum: Gender,
  })
  @IsEnum(Gender, {
    message: 'User Gender must be either male or female',
  })
  gender: string;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  emergencyContact: EmergencyContact;
  currentUser: UserInfo;

  static fromCommand(command: CreateUserCommand): UserEntity {
    const userDomain = new UserEntity();
    userDomain.name = command.name;
    userDomain.email = command.email;
    userDomain.phoneNumber = command.phoneNumber;
    userDomain.gender = command.gender;
    userDomain.address = command.address;
    userDomain.emergencyContact = command.emergencyContact;
    return userDomain;
  }
}
export class UpdateUserCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
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
  @IsEnum(Gender, {
    message: 'User Gender must be either male or female',
  })
  gender: string;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  emergencyContact: EmergencyContact;
  currentUser: UserInfo;
}
export class ArchiveUserCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
