import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class School extends Document {
  @Prop({ required: true })
  school_name: string;

  @Prop({ required: true })
  trustee: string;

  @Prop({ required: true })
  monthly_fees: number;

  @Prop({ required: true, unique: true })
  email: string;  // For school login

  @Prop({ required: true })
  password: string;  // For school login
}

export const SchoolSchema = SchemaFactory.createForClass(School);
