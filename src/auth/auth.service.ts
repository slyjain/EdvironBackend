import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service'; // We'll create this

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // Don't forget to inject JwtService
  ) { }

  // Validate user by email and password
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    // if (user && await bcrypt.compare(password, user.password)) {
    if(user&&password==user.password){
      // Return the user object without the password field
      const { password, ...result } = user;  // Remove password from the result
      return result;  // Only return the sanitized user object
    }
    return null;
  }

  // Create a JWT token and return the user object in the payload (without password)
  async login(user: any) {
    // Remove password from the user object if it wasn't already removed
    const { password, ...userWithoutPassword } = user;
    console.log(userWithoutPassword)
    // Create the payload with the user object excluding the password
    const payload = { user: userWithoutPassword };

    // Sign the token using the JwtService
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET!,  // Explicitly pass the secret here
      expiresIn: '7d',  // You can modify the expiration time
    });
    console.log(access_token);
    // Return the token along with the user object (optional)
    return {
      access_token,
      user: userWithoutPassword,  // Return sanitized user object (without password)
    };
  }
}
