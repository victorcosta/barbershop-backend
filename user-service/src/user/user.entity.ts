import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  tenantId: string; // Identificador do tenant (barbearia)

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole; // Campo para armazenar o papel do usuário
}
