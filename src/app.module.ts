import { Module } from '@nestjs/common';
import { DatabaseConfigModule } from './configs/database-config/database.config.module';
import { ProductsModule } from './apis/products/products.module';
import { OrdersModule } from './apis/orders/orders.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseConfigModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
