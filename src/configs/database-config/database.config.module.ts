import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/apis/auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('Database Host:', configService.get<string>('DB_HOST'));
        console.log('Database Port:', configService.get<number>('DB_PORT'));
        console.log('Database User:', configService.get<string>('DB_USERNAME'));
        console.log('Database Name:', configService.get<string>('DB_NAME'));

        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [User],
          synchronize: true,
          timezone: 'Z',
        };
      },
    }),
  ],
})
export class DatabaseConfigModule {}
