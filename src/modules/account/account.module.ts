import { ResetPasswordTokenEntity } from './persistence/reset-password/reset-password.entity';
import { AccountCommands } from './usecases/accounts/account.usecase.commands';
import { AccountQuery } from './usecases/accounts/account.usecase.queries';
import { AccountRepository } from './persistence/accounts/account.repository';
import { AccountEntity } from '@account/persistence/accounts/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RoleEntity } from './persistence/roles/role.entity';
import { RoleRepository } from './persistence/roles/role.repository';
import { RoleCommands } from './usecases/roles/role.usecase.commands';
import { RoleQueries } from './usecases/roles/role.usecase.queries';
import { RolesController } from './controllers/role.controller';
import { PermissionsController } from './controllers/permission.controller';
import { PermissionEntity } from './persistence/permissions/permission.entity';
import { PermissionCommands } from './usecases/permissions/permission.usecase.commands';
import { PermissionQueries } from './usecases/permissions/permission.usecase.queries';
import { PermissionRepository } from './persistence/permissions/permission.repository';
import { AccountRoleEntity } from './persistence/accounts/account-role.entity';
import { RolePermissionEntity } from './persistence/roles/role-permission.entity';
import { AccountsController } from './controllers/account.controller';
import { AccountPermissionEntity } from './persistence/accounts/account-permission.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { SessionEntity } from './persistence/sessions/session.entity';
import { SessionRepository } from './persistence/sessions/session.repository';
import { SessionCommands } from './usecases/sessions/session.usecase.commands';
import { SessionQuery } from './usecases/sessions/session.usecase.queries';
import { AppService } from 'app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      ResetPasswordTokenEntity,
      RoleEntity,
      PermissionEntity,
      AccountRoleEntity,
      RolePermissionEntity,
      AccountPermissionEntity,
      SessionEntity,
    ]),
    ClientsModule.register([
      {
        name: 'EMAIL_CREDENTIAL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'email_credential_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    PassportModule,
  ],
  controllers: [
    AuthController,
    AccountsController,
    RolesController,
    PermissionsController,
  ],
  providers: [
    AccountRepository,
    AccountQuery,
    AccountCommands,
    RoleRepository,
    RoleCommands,
    RoleQueries,
    PermissionRepository,
    PermissionQueries,
    PermissionCommands,
    JwtStrategy,
    AuthService,
    SessionRepository,
    SessionCommands,
    SessionQuery,
    AppService,
  ],
  exports: [AccountCommands],
})
export class AccountModule {}
