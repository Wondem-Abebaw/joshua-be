import { UserInfo } from '@account/dtos/user-info.dto';
import { CredentialType } from '@libs/common/enums';
import { CanActivate, ExecutionContext, Type } from '@nestjs/common';

export function RolesGuard(roles: string): Type<CanActivate> {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const requiredRoles = roles.split('|');
      if (requiredRoles.length < 1) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const user: UserInfo = request.user;
      if (
        (user.type === CredentialType.School &&
          requiredRoles.includes(CredentialType.School)) ||
        (user.type === CredentialType.Tutor &&
          requiredRoles.includes(CredentialType.Tutor)) ||
        (user.type === CredentialType.Parent &&
          requiredRoles.includes(CredentialType.Parent)) ||
        (user.type === CredentialType.Teacher &&
          requiredRoles.includes(CredentialType.Teacher))
      ) {
        return true;
      } else if (user && user.role) {
        const userRoles = user.role;
        return requiredRoles.some(
          (requiredRole) =>
            userRoles?.key === requiredRole.trim() ||
            userRoles?.key === 'super_admin',
        );
      }
      return false;
    }
  }

  return RolesGuardMixin;
}
