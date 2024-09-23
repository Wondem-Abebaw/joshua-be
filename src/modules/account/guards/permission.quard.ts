import { UserInfo } from '@account/dtos/user-info.dto';
import { CanActivate, ExecutionContext, Type } from '@nestjs/common';

export function PermissionsGuard(permissions: string): Type<CanActivate> {
  class PermissionsGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const requiredPermissions = permissions.split('|');
      if (requiredPermissions.length < 1) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const user: UserInfo = request.user;
      if (user.role && user.role.key === 'super_admin') {
        return true;
      }
      if (user && user.permissions) {
        const userPermissions = user.permissions;
        return requiredPermissions.some((requiredPermission) =>
          userPermissions?.includes(requiredPermission.trim()),
        );
      }
      return false;
    }
  }

  return PermissionsGuardMixin;
}
