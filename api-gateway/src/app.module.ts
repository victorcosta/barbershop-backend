import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user/user.controller';
import { AppointmentController } from './appointment/appointment.controller';
import { AvailabilityController } from './availability/availability.controller';
import { ServiceController } from './services/service.controller';
import { BarberController } from './barber/barber.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'user-service',
          port: parseInt(process.env.USER_PORT, 10),
        },
      },
      {
        name: 'APPOINTMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'appointment-service',
          port: parseInt(process.env.APPOINTMENT_PORT, 10),
        },
      },
      {
        name: 'AVAILABILITY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'availability-service',
          port: parseInt(process.env.AVAILABILITY_PORT, 10),
        },
      },
    ]),
  ],
  controllers: [
    UserController,
    AppointmentController,
    ServiceController,
    AvailabilityController,
    BarberController,
  ],
  providers: [],
})
export class AppModule {}
