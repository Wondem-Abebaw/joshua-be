import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

export class IncludeQuery {
  @ApiProperty()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  includes?: string[];
}
