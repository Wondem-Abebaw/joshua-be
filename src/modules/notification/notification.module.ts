import { NotificationCommands } from './usecases/notifications/notification.usecase.commands';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { NotificationEntity } from './persistence/notifications/notification.entity';
import { NotificationRepository } from './persistence/notifications/notification.repository';
import { NotificationQuery } from './usecases/notifications/notification.usecase.queries';
import { NotificationsController } from './controllers/notification.controller';
import { AppService } from 'app.service';
import { AccountRepository } from '@account/persistence/accounts/account.repository';
import { AccountEntity } from '@account/persistence/accounts/account.entity';
// import { EmployeeQuery } from '@customer/usecases/employee/employee.usecase.queries';
// import { EmployeeEntity } from '@customer/persistence/employee/employee.entity';
// import { PreferredDatetimeEntity } from '@customer/persistence/employee/preferred-datetime.entity';
// import { HiredEntity } from '@customer/persistence/employee/hired.entity';
// import { ParentQuery } from '@customer/usecases/parent/parent.usecase.queries';
// import { ParentEntity } from '@customer/persistence/parent/parent.entity';
// import { FavoriteEmployeeQuery } from '@customer/usecases/parent/favorite-employee.usecase.queries';
// import { FavoriteEmployeeEntity } from '@customer/persistence/parent/favorite-employee.entity';
// import { ParentRepository } from '@customer/persistence/parent/parent.repository';
// import { PaymentEntity } from '@payment/persistence/payments/payment.entity';
// import { PaymentQuery } from '@payment/usecases/payments/payment.usecase.queries';
import { AccountQuery } from '@account/usecases/accounts/account.usecase.queries';
import { AccountRoleEntity } from '@account/persistence/accounts/account-role.entity';
import { AccountPermissionEntity } from '@account/persistence/accounts/account-permission.entity';
import { PermissionEntity } from '@account/persistence/permissions/permission.entity';
import { RoleEntity } from '@account/persistence/roles/role.entity';
// import { KidEntity } from '@customer/persistence/parent/kid.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity,
      AccountEntity,
      // EmployeeEntity,
      // PreferredDatetimeEntity,
      // HiredEntity,
      // ParentEntity,
      // FavoriteEmployeeEntity,
      // PaymentEntity,
      AccountRoleEntity,
      AccountPermissionEntity,
      PermissionEntity,
      RoleEntity,
      // KidEntity,
    ]),
  ],
  providers: [
    NotificationCommands,
    NotificationRepository,
    NotificationQuery,
    AppService,
    AccountRepository,
    AccountQuery,
    // EmployeeQuery,
    // ParentQuery,
    // FavoriteEmployeeQuery,
    // ParentRepository,
    // PaymentQuery,
  ],
  controllers: [NotificationsController],
})
export class NotificationModule {}
