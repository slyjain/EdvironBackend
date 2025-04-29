import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';  // Import ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './users/student/student.module';
import { SchoolModule } from './users/school/school.module';
import { AdminModule } from './users/admin/admin.module';
import { OrdersModule } from './orders/orders.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { WebhookLogsModule } from './webhook-logs/webhook-logs.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Add this line to load the config globally
    AuthModule,
    StudentModule,
    SchoolModule,
    // AdminModule,
    // OrdersModule,
    // OrderStatusModule,
    // WebhookLogsModule,
    // DatabaseModule,
    // JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '7d' } }),
    MongooseModule.forRoot(process.env.MONGO_URI!),  // Use the environment variable for Mongo URI
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
