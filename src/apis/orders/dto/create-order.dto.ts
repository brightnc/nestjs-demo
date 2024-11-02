import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  readonly productId: string;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  readonly quantity: number = 1;
}
