import { UserRole } from '../role.enum';

export class UserResponse {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  tenantId: string;
  role: UserRole;
}
