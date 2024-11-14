import { Controller, Post, Body, HttpStatus, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { signInUserDto } from './dto/signin-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  createAccount(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('signin')
  async signIn(@Body() signInUserDto: signInUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInUserDto);
    const refreshTokenExpiryTime =
      parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME, 10) * 1000; // Convert to milliseconds
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use only in HTTPS in production
      maxAge: refreshTokenExpiryTime,
      sameSite: 'strict',
    });
    res.json({ accessToken });
  }

  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Refresh token not provided' });
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(refreshToken);

    const refreshTokenExpiryTime =
      parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME, 10) * 1000;
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: refreshTokenExpiryTime,
      sameSite: 'strict',
    });

    res.json({ accessToken });
  }
}
