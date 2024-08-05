import { UserRole } from '../role.enum';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  tenantId: string;
  role: UserRole;
}
