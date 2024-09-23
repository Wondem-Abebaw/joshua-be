import * as jwt from 'jsonwebtoken';

import {
  ChangePasswordCommand,
  ForgotPasswordCommand,
  ResetPasswordCommand,
  UpdatePasswordCommand,
  UserLoginCommand,
} from '@account/auth.commands';
import { AllowAnonymous } from '@account/decorators/allow-anonymous.decorator';
import { CurrentUser } from '@account/decorators/current-user.decorator';
import { UserInfo } from '@account/dtos/user-info.dto';
import { JwtAuthGuard } from '@account/guards/jwt-auth.guard';
import { AuthService } from '@account/services/auth.service';
import { Util } from '@libs/common/util';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionCommands } from '@account/usecases/sessions/session.usecase.commands';
import { SessionQuery } from '@account/usecases/sessions/session.usecase.queries';
import { RolesGuard } from '@account/guards/role.quards';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionCommand: SessionCommands,
    private readonly sessionQuery: SessionQuery,
  ) {}
  @Post('login')
  @AllowAnonymous()
  async login(@Body() loginCommand: UserLoginCommand) {
    return this.authService.login(loginCommand);
  }
  @Get('get-user-info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@CurrentUser() user: UserInfo) {
    return user;
  }
  @Post('refresh')
  @AllowAnonymous()
  async getRefreshToken(@Headers() headers: object) {
    if (!headers['x-refresh-token']) {
      throw new ForbiddenException(`Refresh token required`);
    }
    try {
      const refreshToken = headers['x-refresh-token'];
      const session = await this.sessionQuery.getSessionByRefreshToken(
        refreshToken,
      );
      if (!session) {
        throw new UnauthorizedException(
          `Token might be expired. Please login again`,
        );
      }
      const p = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
      ) as UserInfo;
      return {
        accessToken: Util.GenerateToken(
          {
            id: p.id,
            email: p.email,
            name: p.name,
            gender: p.gender,
            type: p.type,
            profileImage: p.profileImage,
            address: p.address,
            role: p.role,
            fcmId: p.fcmId,
            phoneNumber: p?.phoneNumber,
            permissions: p?.permissions,
          },
          '60m',
        ),
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: UserInfo,
    @Body() changePasswordCommand: ChangePasswordCommand,
  ) {
    changePasswordCommand.currentUser = user;
    return this.authService.changePassword(changePasswordCommand);
  }
  @Post('update-password')
  @AllowAnonymous()
  async updatePassword(@Body() command: UpdatePasswordCommand) {
    return this.authService.updatePassword(command);
  }
  @Post('forgot-password')
  @AllowAnonymous()
  async forgetPassword(@Body() command: ForgotPasswordCommand) {
    // console.log(command);
    return this.authService.forgotPassword(command);
  }
  @Post('reset-password')
  @AllowAnonymous()
  async resetPassword(@Body() command: ResetPasswordCommand) {
    return this.authService.resetPassword(command);
  }
  @Post('reset-user-password')
  @UseGuards(RolesGuard('super_admin'))
  async resetUserPassword(@Body() command: ForgotPasswordCommand) {
    return this.authService.resetUserPassword(command);
  }
  @Get('switch-role/:roleId')
  async switchRole(
    @Param('roleId') roleId: string,
    @CurrentUser() currentUser: UserInfo,
  ) {
    return this.authService.switchRole(roleId, currentUser);
  }
  @Post('logout')
  async logout(@Headers() headers: object) {
    const authorization: string = headers['authorization'];
    const token = authorization.split(' ')[1];
    await this.sessionCommand.deleteSessionByToken(token);
    return true;
  }
}
