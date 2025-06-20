import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './v1/users/users.module';
import { CustomersModule } from './v1/customers/customers.module';
import { HealthController } from './health/health.controller';
import { databaseUri } from './config/database.config';
import { OrdersModule } from './v1/orders/orders.module';
import { ProductsModule } from './v1/products/products.module';

@Module({
  imports: [
    MongooseModule.forRoot(databaseUri),
    UsersModule,
    CustomersModule,
    OrdersModule,
    ProductsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
