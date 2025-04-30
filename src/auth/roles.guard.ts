import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../common/decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, 
    private jwtService: JwtService, 
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler()); 

    if (!roles) {
      return true; 
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('No token found');
    }

    const user = this.jwtService.decode(token) as { role: string }; 
    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
