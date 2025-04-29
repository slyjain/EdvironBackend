import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolSchema,School } from './school.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:School.name,schema:SchoolSchema}])],
  providers: [SchoolService],
  controllers: [SchoolController],
  exports:[SchoolService]

})
export class SchoolModule {}
