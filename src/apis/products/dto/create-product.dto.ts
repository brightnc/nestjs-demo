import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly description?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly price: number;
}
