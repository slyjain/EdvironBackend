import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student/student.entity';
import { School } from './school/school.entity';
import { Admin } from './admin/admin.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(School.name) private schoolModel: Model<School>,
        @InjectModel(Admin.name) private adminModel: Model<Admin>,
    ) { }

    async findByEmail(email: string) {
        let user = await this.adminModel.findOne({ email });
        if (user) {
            const plainUser = user.toObject();
            return { ...plainUser, role: 'admin' };
        }

        user = await this.schoolModel.findOne({ email });
        if (user) {
            const plainUser = user.toObject();
            return { ...plainUser, role: 'school' };
        }

        user = await this.studentModel.findOne({ email });
        if (user) {
            const plainUser = user.toObject();
            return { ...plainUser, role: 'student' };
        }

        return null;
    }

}
