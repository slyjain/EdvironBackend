import { Controller, Get, Post, Body } from '@nestjs/common';
import { WebhookLogsService } from './webhook-logs.service';

@Controller('webhook-logs')
export class WebhookLogsController {
  constructor(private readonly webhookLogsService: WebhookLogsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.webhookLogsService.createLog(body);
  }

  @Get()
  async findAll() {
    return this.webhookLogsService.findAll();
  }
}