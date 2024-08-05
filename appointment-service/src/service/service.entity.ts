import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  duration: number; // duração em minutos

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  barbershopId: string; // ou tenantId
}
