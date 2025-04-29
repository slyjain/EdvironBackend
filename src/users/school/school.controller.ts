import { Controller, Get } from '@nestjs/common';
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
}
