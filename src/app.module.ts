import { Module } from '@nestjs/common';
import { DatabaseConfigModule } from './configs/database-config/database.config.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './apis/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseConfigModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
