import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './student.entity';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { SchoolModule } from '../school/school.module';  // import SchoolModule to access school service

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    SchoolModule, 
  ],
  providers: [StudentService],
  controllers: [StudentController],
  exports:[StudentService]
})
export class StudentModule {}
