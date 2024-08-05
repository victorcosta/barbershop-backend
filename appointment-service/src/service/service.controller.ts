import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ServiceService } from './service.service';
import { ServiceDto } from './dto/service.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.interface';

@Controller()
@UseGuards(JwtAuthGuard) // Aplicar o guard em todo o controlador
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @MessagePattern({ cmd: 'get_services' })
  async findAll(data: {
    user: User;
  }): Promise<{ status: number; data: ServiceDto[] }> {
    const { user } = data;
    const services = await this.serviceService.findAll(user);
    return { status: 200, data: services };
  }

  @MessagePattern({ cmd: 'get_service' })
  async findOne(data: {
    id: number;
    user: User;
  }): Promise<{ status: number; data: ServiceDto }> {
    const { id, user } = data;
    const service = await this.serviceService.findOne(id, user);
    return { status: 200, data: service };
  }

  @MessagePattern({ cmd: 'post_service' })
  async create(data: {
    createServiceDto: CreateServiceDto;
    user: User;
  }): Promise<{ status: number; data: ServiceDto }> {
    const { createServiceDto, user } = data;
    const service = await this.serviceService.create(createServiceDto, user);
    return { status: 201, data: service };
  }

  @MessagePattern({ cmd: 'put_service' })
  async update(data: {
    id: number;
    updateServiceDto: ServiceDto;
    user: User;
  }): Promise<{ status: number; data: ServiceDto }> {
    const { id, updateServiceDto, user } = data;
    const service = await this.serviceService.update(
      id,
      updateServiceDto,
      user,
    );
    return { status: 200, data: service };
  }

  @MessagePattern({ cmd: 'delete_service' })
  async remove(data: {
    id: number;
    user: User;
  }): Promise<{ status: number; data: void }> {
    const { id, user } = data;
    await this.serviceService.remove(id, user);
    return { status: 204, data: null };
  }
}
