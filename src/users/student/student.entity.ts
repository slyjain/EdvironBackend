import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { School } from "../school/school.entity";

@Schema()
export class Student extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string; 

    @Prop({ required: true })
    phone_number: string;

    @Prop({ type: Types.ObjectId, ref: 'School', required: true })
    school_id: Types.ObjectId;  

    @Prop({ required: true })
    password: string; 
}

export const StudentSchema = SchemaFactory.createForClass(Student);
