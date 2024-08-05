import { UserRole } from '../role.enum';

export class UpdateUserDto {
  id: number;
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  tenantId: string;
  role: UserRole;
}
