import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';
import { UserRole } from './role.enum';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginResponse } from '../auth/dto/login-response.dto';
import { UserResponse } from './dto/user-response.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern({ cmd: 'get_users' })
  async findAll(data: {
    tenantId: string;
    role: UserRole;
  }): Promise<{ status: number; data: UserResponse[] }> {
    const { tenantId, role } = data;
    const users = await this.userService.findAll(tenantId, role);
    return { status: 200, data: users };
  }

  @MessagePattern({ cmd: 'get_user' })
  async findOne(data: {
    tenantId: string;
    id: number;
    role: UserRole;
  }): Promise<{ status: number; data: UserResponse }> {
    const { tenantId, id, role } = data;
    const user = await this.userService.findOne(tenantId, id, role);
    return { status: 200, data: user };
  }

  @MessagePattern({ cmd: 'post_users_register' })
  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ status: number; data: UserResponse }> {
    const userResponse = await this.authService.register(createUserDto);
    return { status: 201, data: userResponse };
  }

  @MessagePattern({ cmd: 'post_users_login' })
  async login(
    loginDto: LoginDto,
  ): Promise<{ status: number; data: LoginResponse }> {
    const loginResponse = await this.authService.login(loginDto);
    return { status: 200, data: loginResponse };
  }

  @MessagePattern({ cmd: 'put_user' })
  async update(data: {
    tenantId: string;
    id: number;
    user: User;
    role: UserRole;
  }): Promise<{ status: number; data: UserResponse }> {
    const { tenantId, id, user, role } = data;
    const userResponse = await this.userService.update(
      tenantId,
      id,
      user,
      role,
    );
    return { status: 200, data: userResponse };
  }

  @MessagePattern({ cmd: 'delete_user' })
  async remove(data: {
    tenantId: string;
    id: number;
    role: UserRole;
  }): Promise<{ status: number; data: void }> {
    const { tenantId, id, role } = data;
    await this.userService.remove(tenantId, id, role);
    return { status: 204, data: null };
  }
}
