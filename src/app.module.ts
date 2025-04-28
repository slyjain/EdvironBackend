import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './users/student/student.module';
import { SchoolModule } from './users/school/school.module';
import { AdminModule } from './users/admin/admin.module';
import { OrdersModule } from './orders/orders.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { WebhookLogsModule } from './webhook-logs/webhook-logs.module';

@Module({
  imports: [AuthModule, StudentModule, SchoolModule, AdminModule, OrdersModule, OrderStatusModule, WebhookLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
