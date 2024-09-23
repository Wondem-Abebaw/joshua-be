import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  minLength,
  NotEquals,
} from 'class-validator';

export class FileResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(2)
  @NotEquals('undefined')
  filename: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  @NotEquals('undefined')
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(2)
  originalname: string;
  @ApiProperty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @NotEquals('undefined')
  @IsNotEmpty()
  @IsString()
  @Length(2)
  mimetype: string;
  // @ApiProperty()
  size?: number;

  constructor(
    filename: string,
    path: string,
    originalname: string,
    mimetype: string,
    size: number,
  ) {
    this.filename = filename;
    this.path = path;
    this.originalname = originalname;
    this.mimetype = mimetype;
    this.size = size;
  }
}
