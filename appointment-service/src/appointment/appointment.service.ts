import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UserResponse, UserRole } from 'src/auth/user.interface';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async findAll(userId: number, user: UserResponse): Promise<Appointment[]> {
    if (user.role === UserRole.ADMIN_SYSTEM) {
      return this.appointmentRepository.find();
    }
    return this.appointmentRepository.find({ where: { userId } });
  }

  async findOne(id: number, user: UserResponse): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (user.role !== UserRole.ADMIN_SYSTEM) {
      if (appointment.userId !== user.id) {
        throw new UnauthorizedException(
          'You do not have access to this appointment',
        );
      }
    }
    return appointment;
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
    user: UserResponse,
  ): Promise<Appointment> {
    if (
      user.role === UserRole.ADMIN_SYSTEM ||
      (user.role === UserRole.ADMIN_BARBERSHOP &&
        createAppointmentDto.barbershopId === user.tenantId)
    ) {
      const appointment = this.appointmentRepository.create({
        ...createAppointmentDto,
        userId: user.id,
      });

      if (
        !appointment.userId ||
        !appointment.serviceId ||
        !appointment.barberId ||
        !appointment.barbershopId
      ) {
        throw new Error('Invalid user or barber');
      }
      return this.appointmentRepository.save(appointment);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async update(
    id: number,
    updateAppointmentDto: Appointment,
    user: UserResponse,
  ): Promise<Appointment> {
    if (
      user.role === UserRole.ADMIN_SYSTEM ||
      (user.role === UserRole.ADMIN_BARBERSHOP &&
        updateAppointmentDto.barbershopId === user.tenantId)
    ) {
      const existingAppointment = await this.appointmentRepository.findOne({
        where: { id },
      });
      if (!existingAppointment) {
        throw new NotFoundException('Appointment not found');
      }
      if (user.role !== UserRole.ADMIN_SYSTEM) {
        if (existingAppointment.userId !== user.id) {
          throw new UnauthorizedException(
            'You do not have access to update this appointment',
          );
        }
      }
      await this.appointmentRepository.update(id, updateAppointmentDto);
      return this.findOne(id, user);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async remove(id: number, user: UserResponse): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (user.role !== UserRole.ADMIN_SYSTEM) {
      if (appointment.userId !== user.id) {
        throw new UnauthorizedException(
          'You do not have access to delete this appointment',
        );
      }
    }
    await this.appointmentRepository.delete(id);
  }
}
