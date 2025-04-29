import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { School } from "../school/school.entity";

@Schema()
export class Student extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;  // For student login

    @Prop({ required: true })
    phone_number: string;

    @Prop({ type: Types.ObjectId, ref: 'School', required: true })
    school_id: Types.ObjectId;  // Reference to School _id

    @Prop({ required: true })
    password: string;  // For student login
}

export const StudentSchema = SchemaFactory.createForClass(Student);
