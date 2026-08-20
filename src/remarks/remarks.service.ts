
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Remark } from './entities/remark.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CreateRemarkDto } from './dto/create-remark.dto';

@Injectable()
export class RemarksService {
  constructor(
    @InjectRepository(Remark)
    private readonly remarkRepository: Repository<Remark>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  private async resolveTeacher(userId: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { user_id: userId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found for this account');
    }

    return teacher;
  }

  async create(
    dto: CreateRemarkDto,
    user: { id: number; role: string },
  ): Promise<Remark> {
    const student = await this.studentRepository.findOne({
      where: { id: dto.student_id },
    });
    if (!student) {
      throw new BadRequestException(
        `Student with id ${dto.student_id} does not exist`,
      );
    }

    const teacher = await this.resolveTeacher(user.id);

    const remark = this.remarkRepository.create({
      student_id: dto.student_id,
      teacher_id: teacher.id,
      remark: dto.remark,
    });

    return this.remarkRepository.save(remark);
  }

  async findByStudent(
    studentId: number,
    user: { id: number; role: string },
  ): Promise<Remark[]> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with id ${studentId} not found`);
    }

    if (user.role === 'admin') {
      return this.remarkRepository.find({
        where: { student_id: studentId },
        order: { created_at: 'DESC' },
      });
    }

    if (user.role === 'teacher') {
      const teacher = await this.resolveTeacher(user.id);
      if (student.teacher_id !== teacher.id) {
        throw new ForbiddenException(
          'You can only view remarks for your assigned students',
        );
      }
      return this.remarkRepository.find({
        where: { student_id: studentId },
        order: { created_at: 'DESC' },
      });
    }

    if (user.role === 'parent') {
      return this.remarkRepository.find({
        where: { student_id: studentId },
        order: { created_at: 'DESC' },
      });
    }

    throw new ForbiddenException('You are not allowed to view these remarks');
  }

  async remove(id: number, user: { id: number; role: string }): Promise<void> {
    const remark = await this.remarkRepository.findOne({ where: { id } });

    if (!remark) {
      throw new NotFoundException(`Remark with id ${id} not found`);
    }

    if (user.role === 'admin') {
      await this.remarkRepository.remove(remark);
      return;
    }

    if (user.role === 'teacher') {
      const teacher = await this.resolveTeacher(user.id);
      if (remark.teacher_id !== teacher.id) {
        throw new ForbiddenException(
          'You can only delete remarks you created',
        );
      }
      await this.remarkRepository.remove(remark);
      return;
    }

    throw new ForbiddenException('You are not allowed to delete this remark');
  }
}
