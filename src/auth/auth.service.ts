import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service'; // We'll create this

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, 
  ) { }

  // Validate user by email and password
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    // if (user && await bcrypt.compare(password, user.password)) {
    if(user&&password==user.password){
      
      const { password, ...result } = user;  
      return result; 
    }
    return null;
  }

  
  async login(user: any) {
  
    const { password, ...userWithoutPassword } = user;
    console.log(userWithoutPassword)
    
    const payload = { user: userWithoutPassword };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET!,  
      expiresIn: '7d', 
    });
    console.log(access_token);
    
    return {
      access_token,
      user: userWithoutPassword,  
    };
  }
}
