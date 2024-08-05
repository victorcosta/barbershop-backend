import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Availability } from '../availability/availability.entity';

@Entity()
export class Barber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  barbershopId: string;

  @OneToMany(() => Availability, (availability) => availability.barber)
  availabilities: Availability[];
}
