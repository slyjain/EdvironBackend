import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebhookLogDocument = WebhookLog & Document;

@Schema()
export class WebhookLog {
  @Prop({ type: Object, required: true })
  data: any;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);
