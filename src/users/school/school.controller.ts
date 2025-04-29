import { Controller, Get,Param } from '@nestjs/common';
import { SchoolService } from './school.service';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  async getSchoolNames() {
    const schools = await this.schoolService.findAll();
    return schools.map(school => ({
      _id: school._id,
      school_name: school.school_name,
    }));
  }
  @Get('fee/:schoolId')
  async getSchoolFee(@Param('schoolId') schoolId: string) {
    const fee = await this.schoolService.findFeeBySchoolId(schoolId);
    if (!fee) {
      throw new Error('School fee not found');
    }
    return { fee };
  }
}
