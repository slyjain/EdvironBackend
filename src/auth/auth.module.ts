// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';  // this is enough
import { AdminModule } from 'src/users/admin/admin.module';
import { StudentModule } from 'src/users/student/student.module';
import { SchoolModule } from 'src/users/school/school.module';

@Module({
  imports: [
    // console.log(process.env.JWT_SECRET),
    // PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '7d' },
    }),
    AdminModule,
    StudentModule,
    SchoolModule,
    UsersModule, 
  ],
  providers: [
    AuthService, 
    JwtStrategy
  ],
  controllers: [AuthController],
})
export class AuthModule {}
