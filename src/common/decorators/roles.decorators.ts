import { SetMetadata } from '@nestjs/common';

// Define the custom decorator to set the roles metadata
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
