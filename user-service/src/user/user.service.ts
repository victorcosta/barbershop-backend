/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './role.enum';
import { UserResponse } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(tenantId: string, role: UserRole): Promise<UserResponse[]> {
    const selectFields = {
      id: true,
      name: true,
      email: true,
      isActive: true,
      tenantId: true,
      role: true,
    };
    if (role === UserRole.ADMIN_SYSTEM) {
      return this.userRepository.find();
    } else {
      return this.userRepository.find({
        select: selectFields,
        where: { tenantId },
      });
    }
  }

  findOne(tenantId: string, id: number, role: UserRole): Promise<UserResponse> {
    const selectFields = {
      id: true,
      name: true,
      email: true,
      isActive: true,
      tenantId: true,
      role: true,
    };
    if (role === UserRole.ADMIN_SYSTEM) {
      return this.userRepository.findOne({ where: { id } });
    } else {
      return this.userRepository.findOne({
        select: selectFields,
        where: { tenantId, id },
      });
    }
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async create(CreateUserDto: CreateUserDto): Promise<UserResponse> {
    const existingUser = await this.findByEmail(CreateUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const userSaved = await this.userRepository.save(CreateUserDto);
    const { password, ...result } = userSaved;
    return result;
  }

  async update(
    tenantId: string,
    id: number,
    user: User,
    role: UserRole,
  ): Promise<UserResponse> {
    if (
      role === UserRole.ADMIN_SYSTEM ||
      (role === UserRole.ADMIN_BARBERSHOP && user.tenantId === tenantId)
    ) {
      const updatedUser = await this.userRepository.update(id, user);
      if (!updatedUser) {
        throw new InternalServerErrorException();
      }
      return user;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async remove(tenantId: string, id: number, role: UserRole): Promise<void> {
    const userToRemove = await this.userRepository.findOne({ where: { id } });
    if (
      userToRemove &&
      (role === UserRole.ADMIN_SYSTEM ||
        (role === UserRole.ADMIN_BARBERSHOP &&
          userToRemove.tenantId === tenantId))
    ) {
      await this.userRepository.delete(id);
    }
  }
}
