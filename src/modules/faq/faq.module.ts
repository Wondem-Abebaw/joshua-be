import { Module } from '@nestjs/common';
import { FaqController } from './controllers/faq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqEntity } from './persistence/faq.entity';
import { FaqCommands } from './usecases/faq.usecase.commands';
import { FaqQuery } from './usecases/faq.usecase.queries';
import { FaqRepository } from './persistence/faq.repository';
import { FileManagerService } from '@libs/common/file-manager';

@Module({
  controllers: [FaqController],
  imports: [TypeOrmModule.forFeature([FaqEntity])],
  providers: [FaqCommands, FaqQuery, FaqRepository, FileManagerService],
})
export class FaqModule {}
