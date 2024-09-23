import { UserInfo } from './dtos/user-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from './decorators/match.decorator';

export class UserLoginCommand {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  type: string;
  fcmId: string;
}
export class ChangePasswordCommand {
  @ApiProperty()
  @IsNotEmpty()
  currentPassword: string;
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  //@Matches(RegExp('^[a-zA-Z0-9\\-]+$'))
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S+$/, {
  //   message:
  //     'password too weak, It must be combination of Uppercase, lowercase, special character and numbers',
  // })
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  @Match(ChangePasswordCommand, (s) => s.password, {
    message: 'Please confirm your password',
  })
  confirmPassword: string;
  currentUser: UserInfo;
}
export class ForgotPasswordCommand {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  type: string;
}
export class UpdatePasswordCommand {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S+$/, {
  //   message:
  //     'password too weak, It must be combination of Uppercase, lowercase, special character and numbers',
  // })
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  @Match(UpdatePasswordCommand, (s) => s.password, {
    message: 'Please confirm your password',
  })
  confirmPassword: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
}
export class ResetPasswordCommand {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S+$/, {
  //   message:
  //     'password too weak, It must be combination of Uppercase, lowercase, special character and numbers',
  // })
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  @Match(ResetPasswordCommand, (s) => s.password, {
    message: 'Please confirm your password',
  })
  confirmPassword: string;
  @ApiProperty()
  @IsNotEmpty()
  token: string;
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
