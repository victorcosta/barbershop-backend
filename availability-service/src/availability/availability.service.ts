import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from './availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { AvailabilityDto } from './dto/availability.dto';
import { UserResponse, UserRole } from 'src/auth/user.interface';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
  ) {}

  async findAll(user: UserResponse): Promise<Availability[]> {
    return this.availabilityRepository.find({
      where: { barbershopId: user.tenantId },
    });
  }

  async findOne(id: number, user: UserResponse): Promise<Availability> {
    const availability = await this.availabilityRepository.findOne({
      where: { id, barbershopId: user.tenantId },
      relations: ['barber'],
    });
    if (!availability) {
      throw new NotFoundException('Availability not found');
    }
    return availability;
  }

  async create(
    createAvailabilityDto: CreateAvailabilityDto,
    user: UserResponse,
  ): Promise<Availability> {
    if (
      user.role === UserRole.ADMIN_SYSTEM ||
      (user.role === UserRole.ADMIN_BARBERSHOP &&
        createAvailabilityDto.barbershopId === user.tenantId)
    ) {
      const availability = this.availabilityRepository.create(
        createAvailabilityDto,
      );
      return this.availabilityRepository.save(availability);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async update(
    id: number,
    updateAvailabilityDto: AvailabilityDto,
    user: UserResponse,
  ): Promise<Availability> {
    if (
      user.role === UserRole.ADMIN_SYSTEM ||
      (user.role === UserRole.ADMIN_BARBERSHOP &&
        updateAvailabilityDto.barbershopId === user.tenantId)
    ) {
      const existingAvailability = await this.availabilityRepository.findOne({
        where: { id },
      });
      if (!existingAvailability) {
        throw new NotFoundException('Availability not found');
      }
      await this.availabilityRepository.update(id, updateAvailabilityDto);
      return this.findOne(id, user);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async remove(id: number, user: UserResponse): Promise<void> {
    const availability = await this.availabilityRepository.findOne({
      where: { id },
    });
    if (!availability) {
      throw new NotFoundException('Availability not found');
    }
    if (
      user.role !== UserRole.ADMIN_SYSTEM &&
      availability.barbershopId !== user.tenantId
    ) {
      throw new UnauthorizedException(
        'You do not have access to delete this availability',
      );
    }
    await this.availabilityRepository.delete(id);
  }
}
