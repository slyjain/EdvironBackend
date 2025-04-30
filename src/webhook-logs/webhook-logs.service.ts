// webhook-logs.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookLog, WebhookLogDocument } from './webhook-logs.schema';

@Injectable()
export class WebhookLogsService {
  constructor(
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLogDocument>,
  ) {}

  async createLog(data: any): Promise<WebhookLog> {
    const created = new this.webhookLogModel({
      data,
      createdAt: new Date(),
    });
    return created.save();
  }

  async findAll(): Promise<WebhookLog[]> {
    return this.webhookLogModel.find().sort({ createdAt: -1 }).exec();
  }
}

