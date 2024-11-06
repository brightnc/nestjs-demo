import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ResAccessToken, signInUserDto } from './dto/signin-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { STATUS_CODES } from 'http';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, dateOfBirth } = createUserDto;

    const existingAccount = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingAccount) {
      if (existingAccount.username === username) {
        throw new Error('Username already exists');
      }

      if (existingAccount.email === email) {
        throw new Error('Email already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = this.usersRepository.create({
      username,
      password: hashedPassword,
      dateOfBirth,
      email,
    });

    await this.usersRepository.save(account);
    delete account.password;
    console.log('now ===== ', Date.now());

    return account;
  }

  async signIn(signInUserDto: signInUserDto): Promise<ResAccessToken> {
    const { username, password } = signInUserDto;
    const existingAccount = await this.usersRepository.findOne({
      where: { username, deleted_at: IsNull() },
    });
    if (!existingAccount) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, existingAccount.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    delete existingAccount.password;
    const payload = {
      sub: existingAccount.id,
      user: existingAccount,
      token_type: 'Bearer',
    };
    console.log(
      'JWT_EXPIRATION_TIME ===== ',
      this.configService.get<string>('JWT_EXPIRATION_TIME'),
    );
    const expiresIn = isNaN(this.configService.get('JWT_EXPIRATION_TIME'))
      ? this.configService.get('JWT_EXPIRATION_TIME')
      : Number(this.configService.get('JWT_EXPIRATION_TIME'));
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn,
    });

    return {
      accessToken,
      'Max-Age': expiresIn,
      tokenType: payload.token_type,
    };
  }
}
