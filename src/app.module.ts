import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from 'modules/account/account.module';
import { ActivityModule } from 'modules/activity-logger/activity-logger.module';
import { ConfigurationsModule } from 'modules/configurations/configurations.module';
import { FaqModule } from 'modules/faq/faq.module';
import { NotificationModule } from 'modules/notification/notification.module';
import { UserModule } from 'modules/user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { FileManagerService } from '@libs/common/file-manager';
import { RoomModule } from 'modules/room/room.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AccountModule,
    ActivityModule,
    ConfigurationsModule,
    FaqModule,
    NotificationModule,
    UserModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileManagerService],
})
export class AppModule {}
