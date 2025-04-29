import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  school_id: Types.ObjectId | string;

  @Prop({
    type: {
      name: String,
      id: String,
      email: String,
    },
    required: true,
  })
  student_info: {
    name: string;
    id: string;
    email: string;
  };

  @Prop({ required: true })
  collect_request_id: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
