import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
        user: configService.get<string>('DB_USER'),
        pass: configService.get<string>('DB_PASSWORD'),
        dbName: configService.get<string>('DB_NAME'),
      }),
    }),
  ],
})
export class DatabaseConfigModule {}
