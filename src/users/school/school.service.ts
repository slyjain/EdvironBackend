import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { School } from './school.entity';
import { Model } from 'mongoose';
import { hashPassword } from '../../common/utils/hash';

@Injectable()
export class SchoolService {
    constructor(@InjectModel(School.name) private schoolModel: Model<School>) { }

    async create(school: Partial<School>): Promise<School> {
        // school.password = await hashPassword(school.password!);
        const newSchool = new this.schoolModel(school);
        return newSchool.save();
    }
    async findAll(): Promise<School[]> {
        return this.schoolModel.find().exec();
    }
    // Corrected findFeeBySchoolId method
    async findFeeBySchoolId(schoolId: string): Promise<number> {
        const school = await this.schoolModel.findById(schoolId); 
        if (!school) {
            throw new Error('School not found');
        }
        return school.monthly_fees; 
    }
}
