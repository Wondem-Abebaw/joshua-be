import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from '../dtos/user-info.dto';

export const CurrentUser = createParamDecorator<UserInfo>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
