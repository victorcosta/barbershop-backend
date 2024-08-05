import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from './availability.entity';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BarberModule } from 'src/barber/barber.module';

@Module({
  imports: [TypeOrmModule.forFeature([Availability]), BarberModule, AuthModule],
  providers: [AvailabilityService],
  controllers: [AvailabilityController],
})
export class AvailabilityModule {}
