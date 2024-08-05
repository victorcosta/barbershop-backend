import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UserResponse, UserRole } from 'src/auth/user.interface';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async findAll(user: UserResponse): Promise<Service[]> {
    if (user.role === UserRole.ADMIN_SYSTEM) {
      return this.serviceRepository.find();
    }
    return this.serviceRepository.find({
      where: { barbershopId: user.tenantId },
    });
  }

  async findOne(id: number, user: UserResponse): Promise<Service> {
    if (user.role === UserRole.ADMIN_SYSTEM) {
      return await this.serviceRepository.findOne({
        where: { id },
      });
    } else {
      const service = await this.serviceRepository.findOne({
        where: { id, barbershopId: user.tenantId },
      });
      if (!service) {
        throw new NotFoundException('Service not found');
      }
      return service;
    }
  }

  async create(
    createServiceDto: CreateServiceDto,
    user: UserResponse,
  ): Promise<Service> {
    if (
      user.role === UserRole.ADMIN_SYSTEM ||
      (user.role === UserRole.ADMIN_BARBERSHOP &&
        createServiceDto.barbershopId === user.tenantId)
    ) {
      const service = this.serviceRepository.create(createServiceDto);
      return this.serviceRepository.save(service);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async update(
    id: number,
    updateServiceDto: Service,
    user: UserResponse,
  ): Promise<Service> {
    if (
      user.role === UserRole.ADMIN_SYSTEM ||
      (user.role === UserRole.ADMIN_BARBERSHOP &&
        updateServiceDto.barbershopId === user.tenantId)
    ) {
      const existingService = await this.serviceRepository.findOne({
        where: { id },
      });
      if (!existingService) {
        throw new NotFoundException('Service not found');
      }
      await this.serviceRepository.update(id, updateServiceDto);
      return this.findOne(id, user);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async remove(id: number, user: UserResponse): Promise<void> {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    if (
      user.role !== UserRole.ADMIN_SYSTEM &&
      service.barbershopId !== user.tenantId
    ) {
      throw new UnauthorizedException(
        'You do not have access to delete this service',
      );
    }
    await this.serviceRepository.delete(id);
  }
}
