import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BarberService } from './barber.service';
import { BarberDto } from './dto/barber.dto';
import { CreateBarberDto } from './dto/create-barber.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.interface';

@Controller()
@UseGuards(JwtAuthGuard) // Aplicar o guard em todo o controlador
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @MessagePattern({ cmd: 'get_barbers' })
  async findAll(data: {
    user: User;
  }): Promise<{ status: number; data: BarberDto[] }> {
    const { user } = data;
    const barbers = await this.barberService.findAll(user);
    return { status: 200, data: barbers };
  }

  @MessagePattern({ cmd: 'get_barber' })
  async findOne(data: {
    id: number;
    user: User;
  }): Promise<{ status: number; data: BarberDto }> {
    const { id, user } = data;
    const barber = await this.barberService.findOne(id, user);
    return { status: 200, data: barber };
  }

  @MessagePattern({ cmd: 'post_barber' })
  async create(data: {
    createBarberDto: CreateBarberDto;
    user: User;
  }): Promise<{ status: number; data: BarberDto }> {
    const { createBarberDto, user } = data;
    const barber = await this.barberService.create(createBarberDto, user);
    return { status: 201, data: barber };
  }

  @MessagePattern({ cmd: 'put_barber' })
  async update(data: {
    id: number;
    updateBarberDto: BarberDto;
    user: User;
  }): Promise<{ status: number; data: BarberDto }> {
    const { id, updateBarberDto, user } = data;
    const barber = await this.barberService.update(id, updateBarberDto, user);
    return { status: 200, data: barber };
  }

  @MessagePattern({ cmd: 'delete_barber' })
  async remove(data: {
    id: number;
    user: User;
  }): Promise<{ status: number; data: void }> {
    const { id, user } = data;
    await this.barberService.remove(id, user);
    return { status: 204, data: null };
  }
}
