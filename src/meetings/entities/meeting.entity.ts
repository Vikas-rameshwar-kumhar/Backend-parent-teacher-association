import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('meetings')
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  meeting_date: Date;

  @Column({ type: 'time' })
  meeting_time: string;

  @Column({ type: 'varchar', length: 20 })
  mode: string;

  @Column({ type: 'varchar', length: 20, default: 'scheduled' })
  status: string;

  @Column({ name: 'created_by' })
  created_by: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;
}