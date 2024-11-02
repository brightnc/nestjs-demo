import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly description?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  readonly price?: number;
}
