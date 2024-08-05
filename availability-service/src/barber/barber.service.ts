import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barber } from './barber.entity';
import { CreateBarberDto } from './dto/create-barber.dto';
import { BarberDto } from './dto/barber.dto';
import { UserResponse, UserRole } from 'src/auth/user.interface';

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(Barber)
    private readonly barberRepository: Repository<Barber>,
  ) {}

  async findAll(user: UserResponse): Promise<Barber[]> {
    return this.barberRepository.find({
      where: { barbershopId: user.tenantId },
    });
  }

  async findOne(id: number, user: UserResponse): Promise<Barber> {
    const barber = await this.barberRepository.findOne({
      where: { id, barbershopId: user.tenantId },
    });
    if (!barber) {
      throw new NotFoundException('Barber not found');
    }
    return barber;
  }

  async create(
    createBarberDto: CreateBarberDto,
    user: UserResponse,
  ): Promise<Barber> {
    if (
      user.role === UserRole.ADMIN_SYSTEM ||
      (user.role === UserRole.ADMIN_BARBERSHOP &&
        createBarberDto.barbershopId === user.tenantId)
    ) {
      const barber = this.barberRepository.create(createBarberDto);
      return this.barberRepository.save(barber);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async update(
    id: number,
    updateBarberDto: BarberDto,
    user: UserResponse,
  ): Promise<Barber> {
    if (
      user.role === UserRole.ADMIN_SYSTEM ||
      (user.role === UserRole.ADMIN_BARBERSHOP &&
        updateBarberDto.barbershopId === user.tenantId)
    ) {
      const existingBarber = await this.barberRepository.findOne({
        where: { id },
      });
      if (!existingBarber) {
        throw new NotFoundException('Barber not found');
      }
      await this.barberRepository.update(id, updateBarberDto);
      return this.findOne(id, user);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async remove(id: number, user: UserResponse): Promise<void> {
    const barber = await this.barberRepository.findOne({
      where: { id },
    });
    if (!barber) {
      throw new NotFoundException('Barber not found');
    }
    if (
      user.role !== UserRole.ADMIN_SYSTEM &&
      barber.barbershopId !== user.tenantId
    ) {
      throw new UnauthorizedException(
        'You do not have access to delete this barber',
      );
    }
    await this.barberRepository.delete(id);
  }
}
