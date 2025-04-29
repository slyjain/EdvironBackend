import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class StudentSignupDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    password: string;

    @IsString()
    phone: string;

    @IsNotEmpty()
    schoolId: string;

    @IsNotEmpty()
    role: 'student';
}
