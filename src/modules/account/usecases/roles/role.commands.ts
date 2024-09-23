import { Role } from '@account/domains/roles/role';
import { UserInfo } from '@account/dtos/user-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoleCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  key: string;
  protected: boolean;
  currentUser: UserInfo;
  static fromCommand(command: CreateRoleCommand): Role {
    const roleDomain = new Role();
    roleDomain.name = command.name;
    roleDomain.name = command.key;
    roleDomain.protected = command.protected;
    return roleDomain;
  }
}

export class UpdateRoleCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  key: string;
  currentUser: UserInfo;
}
export class ArchiveRoleCommand {
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
