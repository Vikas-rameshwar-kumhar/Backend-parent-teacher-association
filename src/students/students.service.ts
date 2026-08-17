

// import {
//   Injectable,
//   NotFoundException,
//   ConflictException,
//   BadRequestException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Student } from './entities/student.entity';
// import { Teacher } from '../teachers/entities/teacher.entity';
// import { Parent } from '../parents/entities/parent.entity';
// import { CreateStudentDto } from './dto/create-student.dto';
// import { UpdateStudentDto } from './dto/update-student.dto';

// @Injectable()
// export class StudentsService {
//   constructor(
//     @InjectRepository(Student)
//     private readonly studentRepository: Repository<Student>,
//     @InjectRepository(Teacher)
//     private readonly teacherRepository: Repository<Teacher>,
//     @InjectRepository(Parent)
//     private readonly parentRepository: Repository<Parent>,
//   ) {}

//   async create(dto: CreateStudentDto): Promise<Student> {
//     const existingRollNumber = await this.studentRepository.findOne({
//       where: { roll_number: dto.roll_number },
//     });

//     if (existingRollNumber) {
//       throw new ConflictException('Roll number already in use');
//     }

//     const teacher = await this.teacherRepository.findOne({
//       where: { id: dto.teacher_id },
//     });
//     if (!teacher) {
//       throw new BadRequestException(
//         `Teacher with id ${dto.teacher_id} does not exist`,
//       );
//     }

//     const parent = await this.parentRepository.findOne({
//       where: { id: dto.parent_id },
//     });
//     if (!parent) {
//       throw new BadRequestException(
//         `Parent with id ${dto.parent_id} does not exist`,
//       );
//     }

//     const student = this.studentRepository.create(dto);
//     return this.studentRepository.save(student);
//   }

//   async findAll(): Promise<Student[]> {
//     return this.studentRepository.find({
//       order: { id: 'ASC' },
//     });
//   }

//   async findOne(id: number): Promise<Student> {
//     const student = await this.studentRepository.findOne({ where: { id } });

//     if (!student) {
//       throw new NotFoundException(`Student with id ${id} not found`);
//     }

//     return student;
//   }

//   async update(id: number, dto: UpdateStudentDto): Promise<Student> {
//     const student = await this.findOne(id);

//     if (dto.roll_number && dto.roll_number !== student.roll_number) {
//       const existingRollNumber = await this.studentRepository.findOne({
//         where: { roll_number: dto.roll_number },
//       });
//       if (existingRollNumber) {
//         throw new ConflictException('Roll number already in use');
//       }
//     }

//     if (dto.teacher_id) {
//       const teacher = await this.teacherRepository.findOne({
//         where: { id: dto.teacher_id },
//       });
//       if (!teacher) {
//         throw new BadRequestException(
//           `Teacher with id ${dto.teacher_id} does not exist`,
//         );
//       }
//     }

//     if (dto.parent_id) {
//       const parent = await this.parentRepository.findOne({
//         where: { id: dto.parent_id },
//       });
//       if (!parent) {
//         throw new BadRequestException(
//           `Parent with id ${dto.parent_id} does not exist`,
//         );
//       }
//     }

//     Object.assign(student, dto);

//     return this.studentRepository.save(student);
//   }

//   async remove(id: number): Promise<void> {
//     const student = await this.findOne(id);
//     await this.studentRepository.remove(student);
//   }
// }

















import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Parent } from '../parents/entities/parent.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
  ) {}

  async create(dto: CreateStudentDto): Promise<Student> {
    const existingRollNumber = await this.studentRepository.findOne({
      where: { roll_number: dto.roll_number },
    });

    if (existingRollNumber) {
      throw new ConflictException('Roll number already in use');
    }

    const teacher = await this.teacherRepository.findOne({
      where: { id: dto.teacher_id },
    });
    if (!teacher) {
      throw new BadRequestException(
        `Teacher with id ${dto.teacher_id} does not exist`,
      );
    }

    const parent = await this.parentRepository.findOne({
      where: { id: dto.parent_id },
    });
    if (!parent) {
      throw new BadRequestException(
        `Parent with id ${dto.parent_id} does not exist`,
      );
    }

    const student = this.studentRepository.create(dto);
    return this.studentRepository.save(student);
  }

  async findAll(user: { id: number; role: string }): Promise<Student[]> {
    if (user.role === 'admin') {
      return this.studentRepository.find({ order: { id: 'ASC' } });
    }

    if (user.role === 'teacher') {
      const teacher = await this.teacherRepository.findOne({
        where: { user_id: user.id },
      });
      if (!teacher) {
        throw new NotFoundException('Teacher profile not found for this account');
      }
      return this.studentRepository.find({
        where: { teacher_id: teacher.id },
        order: { id: 'ASC' },
      });
    }

    if (user.role === 'parent') {
      const parent = await this.parentRepository.findOne({
        where: { user_id: user.id },
      });
      if (!parent) {
        throw new NotFoundException('Parent profile not found for this account');
      }
      return this.studentRepository.find({
        where: { parent_id: parent.id },
        order: { id: 'ASC' },
      });
    }

    return [];
  }

  private async findByIdOrFail(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });

    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    return student;
  }

  async findOne(id: number, user: { id: number; role: string }): Promise<Student> {
    const student = await this.findByIdOrFail(id);

    if (user.role === 'admin') {
      return student;
    }

    if (user.role === 'teacher') {
      const teacher = await this.teacherRepository.findOne({
        where: { user_id: user.id },
      });
      if (!teacher || student.teacher_id !== teacher.id) {
        throw new NotFoundException(`Student with id ${id} not found`);
      }
      return student;
    }

    if (user.role === 'parent') {
      const parent = await this.parentRepository.findOne({
        where: { user_id: user.id },
      });
      if (!parent || student.parent_id !== parent.id) {
        throw new NotFoundException(`Student with id ${id} not found`);
      }
      return student;
    }

    throw new NotFoundException(`Student with id ${id} not found`);
  }

  async update(id: number, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findByIdOrFail(id);

    if (dto.roll_number && dto.roll_number !== student.roll_number) {
      const existingRollNumber = await this.studentRepository.findOne({
        where: { roll_number: dto.roll_number },
      });
      if (existingRollNumber) {
        throw new ConflictException('Roll number already in use');
      }
    }

    if (dto.teacher_id) {
      const teacher = await this.teacherRepository.findOne({
        where: { id: dto.teacher_id },
      });
      if (!teacher) {
        throw new BadRequestException(
          `Teacher with id ${dto.teacher_id} does not exist`,
        );
      }
    }

    if (dto.parent_id) {
      const parent = await this.parentRepository.findOne({
        where: { id: dto.parent_id },
      });
      if (!parent) {
        throw new BadRequestException(
          `Parent with id ${dto.parent_id} does not exist`,
        );
      }
    }

    Object.assign(student, dto);

    return this.studentRepository.save(student);
  }

  async remove(id: number): Promise<void> {
    const student = await this.findByIdOrFail(id);
    await this.studentRepository.remove(student);
  }
} 




// Hello, there!