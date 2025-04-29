import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TransactionStatus extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Transaction', required: true })
  collect_id: Types.ObjectId;

  @Prop({ required: true })
  order_amount: number;

  @Prop({ required: true })
  transaction_amount: number;

  @Prop({ required: true })
  payment_mode: string;

  @Prop({ required: true })
  payment_details: string; // Store as stringified JSON

  @Prop({ required: true })
  bank_reference: string;

  @Prop()
  payment_message: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  error_message: string;

  @Prop()
  payment_time: Date;
}

export const TransactionStatusSchema = SchemaFactory.createForClass(TransactionStatus);
