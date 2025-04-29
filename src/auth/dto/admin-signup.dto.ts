import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminSignupDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsNotEmpty()
    role: 'admin';
}
