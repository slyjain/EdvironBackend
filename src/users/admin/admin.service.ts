import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.entity';
import { hashPassword } from '../../common/utils/hash';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
  ) {}


  async create(adminData: Partial<Admin>): Promise<Admin> {
    adminData.password = await hashPassword(adminData.password!);
    const newAdmin = new this.adminModel(adminData);
    return newAdmin.save();
  }

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ email }).exec();
  }
}
