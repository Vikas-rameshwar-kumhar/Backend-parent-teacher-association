import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Teacher } from './entities/teacher.entity';
import { User } from '../users/entities/user.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UserRole } from 'src/users/users_enum/users.enum';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateTeacherDto): Promise<Teacher> {
    const existingUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { email: dto.email } });
 
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const existingTeacher = await this.dataSource
      .getRepository(Teacher)
      .findOne({ where: { employee_code: dto.employee_code } });

    if (existingTeacher) {
      throw new ConflictException('Employee code already in use');
    }


    return this.dataSource.transaction(async (manager) => {
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = manager.create(User, {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: UserRole.TEACHER,
      });
      const savedUser = await manager.save(user);

      const teacher = manager.create(Teacher, {
        employee_code: dto.employee_code,
        subject: dto.subject,
        qualification: dto.qualification,
        experience: dto.experience,
        user_id: savedUser.id,
      });

      return manager.save(teacher);
    });
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    return teacher;
  }


async update(id: number, dto: UpdateTeacherDto): Promise<Teacher> {
  const teacher = await this.findOne(id);

  const { name, email, phone, password, ...teacherFields } = dto;

  return this.dataSource.transaction(async (manager) => {
    if (name || email || phone || password) {
      const userUpdate: Partial<User> = {};
      if (name) userUpdate.name = name;
      if (email) userUpdate.email = email;
      if (phone) userUpdate.phone = phone;
      if (password) userUpdate.password = await bcrypt.hash(password, 10);

      await manager.update(User, teacher.user_id, userUpdate);
    }

    if (Object.keys(teacherFields).length > 0) {
      await manager.update(Teacher, id, teacherFields);
    }

    const updatedTeacher = await manager.findOne(Teacher, { where: { id } });

    if (!updatedTeacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }

    return updatedTeacher;
  });
}


  async remove(id: number): Promise<void> {
    const teacher = await this.findOne(id);
    await this.teacherRepository.remove(teacher);
  }

}