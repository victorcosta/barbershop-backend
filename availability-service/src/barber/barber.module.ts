import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barber } from './barber.entity';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Barber]), AuthModule],
  providers: [BarberService],
  controllers: [BarberController],
})
export class BarberModule {}
