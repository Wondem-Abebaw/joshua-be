import { UserInfo } from '@account/dtos/user-info.dto';
import { FileDto } from '@libs/common/file-dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Faq } from '../domains/faq';

export class CreateFaqCommand {
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  tags: string[];
  //   coverImage: FileDto;
  currentUser: UserInfo;
  static fromCommand(command: CreateFaqCommand): Faq {
    const faqDomain = new Faq();
    faqDomain.title = command.title;
    faqDomain.description = command.description;
    faqDomain.tags = command.tags;
    // newsDomain.coverImage = command.coverImage;
    return faqDomain;
  }
}
export class UpdateFaqCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  tags: string[];
  //   coverImage: FileDto;
  currentUser: UserInfo;
}
export class ArchiveFaqCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
