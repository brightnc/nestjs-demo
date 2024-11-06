import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { signInUserDto } from './dto/signin-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { createResponse } from 'src/utils/response.util';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async createAccount(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.authService.create(createUserDto);
      return createResponse(
        HttpStatus.CREATED,
        'Successfully created account',
        result,
      );
    } catch (error) {
      if (error instanceof Error)
        return createResponse(HttpStatus.CONFLICT, error.message);
    }
  }
  @Post('signin')
  @HttpCode(200)
  signIn(@Body() signInUserDto: signInUserDto) {
    return this.authService.signIn(signInUserDto);
  }
}
