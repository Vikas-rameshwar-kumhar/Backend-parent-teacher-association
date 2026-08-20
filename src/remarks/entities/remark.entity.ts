import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

@Entity('remarks')
export class Remark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id' })
  student_id: number;

  @ManyToOne(() => Student, { eager: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'teacher_id' })
  teacher_id: number;

  @ManyToOne(() => Teacher, { eager: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ type: 'text' })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}