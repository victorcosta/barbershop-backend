import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  serviceId: number; // Apenas o ID do Serviço

  @Column()
  userId: number; // Apenas o ID do usuário

  @Column()
  barberId: number; // Apenas o ID do barbeiro

  @Column()
  barbershopId: string;
}
