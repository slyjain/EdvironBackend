import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class TrusteeSignupDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  schoolName: string;

  @IsString()
  monthlyFees: string;

  @IsNotEmpty()
  role: 'trustee';
}
