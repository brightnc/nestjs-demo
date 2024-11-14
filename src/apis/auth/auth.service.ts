import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ResAccessToken, signInUserDto } from './dto/signin-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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

    const existingAccount = await this.findUserByUsernameOrEmail(
      username,
      email,
    );
    if (existingAccount) {
      if (existingAccount.username === username) {
        throw new ConflictException('Username already exists');
      }

      if (existingAccount.email === email) {
        throw new ConflictException('Email already exists');
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
    return account;
  }

  async signIn(signInUserDto: signInUserDto): Promise<ResAccessToken> {
    const { username, password } = signInUserDto;
    const existingAccount = await this.findByUsernameAndNotDeleted(username);
    if (!existingAccount) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, existingAccount.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }
    delete existingAccount.password;
    const payload = {
      userId: String(existingAccount.id),
    };
    return this.generateTokens(payload);
  }

  async refreshToken(refreshToken: string): Promise<ResAccessToken> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      return this.generateTokens(payload);
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  // Utility method for checking if user exists
  private async findUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [{ username }, { email }],
    });
  }

  private async findByUsernameAndNotDeleted(
    username: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username, deleted_at: IsNull() },
    });
  }

  // Utility method for generating tokens
  private async generateTokens(payload: { userId: string }) {
    const accessTokenExpiresIn = Number(
      this.configService.get('JWT_EXPIRATION_TIME', 3600),
    ); // Default 1 hour
    const refreshTokenExpiresIn = Number(
      this.configService.get('JWT_REFRESH_EXPIRATION_TIME', 86400),
    ); // Default 1 day

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: refreshTokenExpiresIn,
    });

    return { accessToken, refreshToken };
  }
}
