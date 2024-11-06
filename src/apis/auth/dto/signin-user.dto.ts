import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class signInUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}

export class ResAccessToken {
  readonly accessToken: string;
  readonly 'Max-Age': string;
  readonly tokenType: string;
}
