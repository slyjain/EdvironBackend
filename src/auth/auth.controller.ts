// auth.controller.ts
import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminService } from '../users/admin/admin.service';
import { SchoolService } from '../users/school/school.service';
import { StudentService } from '../users/student/student.service';
import { UsersService } from '../users/users.service';  // For checking if user already exists
import { StudentSignupDto } from './dto/student-signup.dto';
import { TrusteeSignupDto } from './dto/trustee-signup.dto';
import { AdminSignupDto } from './dto/admin-signup.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private schoolService: SchoolService,
    private studentService: StudentService,
    private usersService: UsersService,
  ) {}

  // @Post('login')
  // async login(@Body() body: { email: string; password: string }) {
  //   console.log(body);
  //   const user = await this.authService.validateUser(body.email, body.password);
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   return this.authService.login(user);
  // }


  @Post('signup')
  async signup(@Body() body: any) {
    console.log("Reached in signup body")
    const { role } = body;
  
    if (!role) {
      throw new BadRequestException('Role is required');
    }
  
    if (role === 'student') {
      console.log("role identified as student")
      const studentData = body as StudentSignupDto;
      const existingUser = await this.usersService.findByEmail(studentData.email);
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
      await this.studentService.create(studentData);
    }
    else if (role === 'trustee') {
      console.log("role identified as trustee")
      const trusteeData = body as TrusteeSignupDto;
      console.log(trusteeData)
      const existingUser = await this.usersService.findByEmail(trusteeData.email);
      console.log(existingUser,"Is findByEmail working properly");
      if (existingUser) {
        
        throw new BadRequestException('Email already exists');
      }

      console.log("existing user toh nahi hai")
      const schoolData = {
        ...trusteeData,
        trustee: trusteeData.email, // setting trustee field as email
      }
      await this.schoolService.create(schoolData);
    }
    else if (role === 'admin') {
      console.log("role identified as admin")
      const adminData = body as AdminSignupDto;
      const existingUser = await this.usersService.findByEmail(adminData.email);
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
      await this.adminService.create(adminData);
    }
    else {
      throw new BadRequestException('Invalid role');
    }
  
    return { success: true };
  }
  
}
