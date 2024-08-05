import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AvailabilityService } from './availability.service';
import { AvailabilityDto } from './dto/availability.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.interface';

@Controller()
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @MessagePattern({ cmd: 'get_availabilities' })
  async findAll(data: {
    user: User;
  }): Promise<{ status: number; data: AvailabilityDto[] }> {
    const { user } = data;
    const availabilities = await this.availabilityService.findAll(user);
    return { status: 200, data: availabilities };
  }

  @MessagePattern({ cmd: 'get_availability' })
  async findOne(data: {
    id: number;
    user: User;
  }): Promise<{ status: number; data: AvailabilityDto }> {
    const { id, user } = data;
    const availability = await this.availabilityService.findOne(id, user);
    return { status: 200, data: availability };
  }

  @MessagePattern({ cmd: 'post_availability' })
  async create(data: {
    createAvailabilityDto: CreateAvailabilityDto;
    user: User;
  }): Promise<{ status: number; data: AvailabilityDto }> {
    const { createAvailabilityDto, user } = data;
    const availability = await this.availabilityService.create(
      createAvailabilityDto,
      user,
    );
    return { status: 201, data: availability };
  }

  @MessagePattern({ cmd: 'put_availability' })
  async update(data: {
    id: number;
    AvailabilityDto: AvailabilityDto;
    user: User;
  }): Promise<{ status: number; data: AvailabilityDto }> {
    const { id, AvailabilityDto, user } = data;
    const availability = await this.availabilityService.update(
      id,
      AvailabilityDto,
      user,
    );
    return { status: 200, data: availability };
  }

  @MessagePattern({ cmd: 'delete_availability' })
  async remove(data: {
    id: number;
    user: User;
  }): Promise<{ status: number; data: void }> {
    const { id, user } = data;
    await this.availabilityService.remove(id, user);
    return { status: 204, data: null };
  }
}
