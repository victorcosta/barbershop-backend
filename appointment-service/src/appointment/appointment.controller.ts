import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppointmentService } from './appointment.service';
import { AppointmentDto } from './dto/appointment.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.interface';

@Controller()
@UseGuards(JwtAuthGuard) // Aplicar o guard em todo o controlador
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @MessagePattern({ cmd: 'get_appointments' })
  async findAll(data: {
    user: User;
  }): Promise<{ status: number; data: AppointmentDto[] }> {
    const { user } = data;
    const appointments = await this.appointmentService.findAll(user.id, user);
    return { status: 200, data: appointments };
  }

  @MessagePattern({ cmd: 'get_appointment' })
  async findOne(data: {
    id: number;
    user: User;
  }): Promise<{ status: number; data: AppointmentDto }> {
    const { id, user } = data;
    const appointment = await this.appointmentService.findOne(id, user);
    return { status: 200, data: appointment };
  }

  @MessagePattern({ cmd: 'post_appointment' })
  async create(data: {
    createAppointmentDto: CreateAppointmentDto;
    user: User;
  }): Promise<{ status: number; data: AppointmentDto }> {
    const { createAppointmentDto, user } = data;
    const appointment = await this.appointmentService.create(
      createAppointmentDto,
      user,
    );
    return { status: 201, data: appointment };
  }

  @MessagePattern({ cmd: 'put_appointment' })
  async update(data: {
    id: number;
    updateAppointmentDto: AppointmentDto;
    user: User;
  }): Promise<{ status: number; data: AppointmentDto }> {
    const { id, updateAppointmentDto, user } = data;
    const appointment = await this.appointmentService.update(
      id,
      updateAppointmentDto,
      user,
    );
    return { status: 200, data: appointment };
  }

  @MessagePattern({ cmd: 'delete_appointment' })
  async remove(data: {
    id: number;
    user: User;
  }): Promise<{ status: number; data: void }> {
    const { id, user } = data;
    await this.appointmentService.remove(id, user);
    return { status: 204, data: null };
  }
}
