import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { Student, StudentSchema } from './student/student.entity';
import { School, SchoolSchema } from './school/school.entity';
import { Admin, AdminSchema } from './admin/admin.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: School.name, schema: SchoolSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],  
})
export class UsersModule {}
