import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity('teacher_addresses')
export class TeacherAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'teacher_id', unique: true })
  teacher_id: number;

  @OneToOne(() => Teacher)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'int' })
  pin_code: number;
}