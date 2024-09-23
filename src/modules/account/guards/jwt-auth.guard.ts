import { extractCurrentUser } from '@account/utilities/extract-current-user';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOW_ANONYMOUS_META_KEY } from '../decorators/allow-anonymous.decorator';

Injectable();
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isAnonymousAllowed =
      this.reflector?.get<boolean>(
        ALLOW_ANONYMOUS_META_KEY,
        context.getHandler(),
      ) ||
      this.reflector?.get<boolean>(
        ALLOW_ANONYMOUS_META_KEY,
        context.getClass(),
      );
    if (isAnonymousAllowed) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    if (!user) {
      throw err || new UnauthorizedException(info.message);
    }
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const userInfo = extractCurrentUser(user, headers);

    if (err || !userInfo) {
      throw err || new UnauthorizedException(info.message);
    }

    return userInfo;
  }
}
