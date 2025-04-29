import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student.entity';
import { SchoolService } from '../school/school.service';
import { hashPassword } from '../../common/utils/hash';
@Injectable()
export class StudentService {
    constructor(@InjectModel(Student.name) private studentModel: Model<Student>, private schoolService: SchoolService) {

    }
    async create(student: Partial<Student>): Promise<Student> {
        const school = await this.schoolService.findAll();
        if (!school) {
            throw new Error('School not found');
        }
        student.password = await hashPassword(student.password!);
        const newStudent = new this.studentModel(student);
        return newStudent.save();
    }
    async findAll(): Promise<Student[]> {
        return this.studentModel.find().populate('school_id').exec();
    }

}
