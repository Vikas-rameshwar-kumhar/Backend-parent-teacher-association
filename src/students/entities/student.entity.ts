import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Parent } from '../../parents/entities/parent.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  student_name: string;

  @Column({ type: 'varchar', length: 20 })
  class: string;

  @Column({ type: 'varchar', length: 10 })
  section: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  roll_number: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ type: 'varchar', length: 10 })
  gender: string;

  @Column({ name: 'teacher_id' })
  teacher_id: number;

  @ManyToOne(() => Teacher, { eager: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ name: 'parent_id' })
  parent_id: number;

  @ManyToOne(() => Parent, { eager: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;
}