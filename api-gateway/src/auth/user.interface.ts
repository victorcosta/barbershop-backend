import { UserRole } from './role.enum';

export interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  tenantId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}
