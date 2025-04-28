import { Module } from '@nestjs/common';
import { WebhookLogsService } from './webhook-logs.service';
import { WebhookLogsController } from './webhook-logs.controller';

@Module({
  providers: [WebhookLogsService],
  controllers: [WebhookLogsController]
})
export class WebhookLogsModule {}
