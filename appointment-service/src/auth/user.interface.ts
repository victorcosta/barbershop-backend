export enum UserRole {
  ADMIN_SYSTEM = 'admin_system',
  ADMIN_BARBERSHOP = 'admin_barbershop',
  USER_APP = 'user_app',
}

export interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  tenantId: string;
  role: UserRole;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  tenantId: string;
  role: UserRole;
}
