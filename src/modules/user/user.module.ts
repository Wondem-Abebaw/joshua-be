import { AccountModule } from '@account/account.module';
import { UserEntity } from '@user/persistence/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCommands } from './usecases/users/user.usecase.commands';
import { UserRepository } from './persistence/users/user.repository';
import { UsersController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { UserQuery } from './usecases/users/user.usecase.queries';
import { FileManagerService } from '@libs/common/file-manager';
import { ActivityRepository } from '@activity-logger/persistence/activities/activity.repository';
import { ActivityEntity } from '@activity-logger/persistence/activities/activity.entity';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([UserEntity, ActivityEntity]),
    AccountModule,
  ],
  providers: [
    UserRepository,
    UserCommands,
    UserQuery,
    FileManagerService,
    ActivityRepository,
  ],
})
export class UserModule {}
