import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../common/decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // Reflector allows us to access metadata set by decorators
    private jwtService: JwtService, // We'll use this to decode JWT tokens
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler()); // Get roles metadata

    if (!roles) {
      return true; // If no roles are set, allow access
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Extract JWT token from Authorization header

    if (!token) {
      throw new ForbiddenException('No token found');
    }

    const user = this.jwtService.decode(token) as { role: string }; // Decode JWT to get user role

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
