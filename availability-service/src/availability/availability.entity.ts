import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Barber } from '../barber/barber.entity';

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  barberId: number;

  @Column()
  barbershopId: string; //

  @Column()
  dayOfWeek: number; // 0 (Domingo) a 6 (Sábado)

  @Column()
  startTime: string; // 09:00

  @Column()
  endTime: string; // 17:00

  @ManyToOne(() => Barber, (barber) => barber.availabilities)
  barber: Barber;
}
