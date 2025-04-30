import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';  // Import ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './users/student/student.module';
import { SchoolModule } from './users/school/school.module';
import { AdminModule } from './users/admin/admin.module';
import { WebhookLogsModule } from './webhook-logs/webhook-logs.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  
    AuthModule,
    StudentModule,
    SchoolModule,
    AdminModule,
    JwtModule.register({ secret: process.env.JWT_SECRET!, signOptions: { expiresIn: '1h' } }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    PaymentModule, 
  ],
  controllers: [AppController],
  providers: [
    AppService,
   
  ],
})
export class AppModule {}
