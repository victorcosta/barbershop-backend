export class CreateAppointmentDto {
  date: Date;
  serviceId: number;
  userId: number;
  barberId: number;
  barbershopId: string; //tendantId
}
