
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Teacher } from './entities/teacher.entity';
import { TeacherAddress } from './entities/teacher-address.entity';
import { User } from '../users/entities/user.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { UserRole } from 'src/users/users_enum/users.enum';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly dataSource: DataSource,
  ) {}

  // async create(dto: CreateTeacherDto): Promise<Teacher> {
  //   const existingUser = await this.dataSource
  //     .getRepository(User)
  //     .findOne({ where: { email: dto.email } });

  //   if (existingUser) {
  //     throw new ConflictException('Email already in use');
  //   }

  //   const existingTeacher = await this.dataSource
  //     .getRepository(Teacher)
  //     .findOne({ where: { employee_code: dto.employee_code } });

  //   if (existingTeacher) {
  //     throw new ConflictException('Employee code already in use');
  //   }

  //   const hashedPassword = await bcrypt.hash(dto.password, 10);

  //   // 1. Create the linked User account (role is always 'teacher' here —
  //   // never taken from client input, since this endpoint IS the source
  //   // of truth for "this person is a teacher")
  //   const user = this.dataSource.getRepository(User).create({
  //     name: dto.name,
  //     email: dto.email,
  //     phone: dto.phone,
  //     password: hashedPassword,
  //     role: UserRole.TEACHER,
  //     // role: 'teacher',
  //   });
  //   const savedUser = await this.dataSource.getRepository(User).save(user);

  //   // 2. Create the Teacher profile, linked to that User
  //   const teacher = this.teacherRepository.create({
  //     employee_code: dto.employee_code,
  //     subject: dto.subject,
  //     qualification: dto.qualification,
  //     experience: dto.experience,
  //     user_id: savedUser.id,
  //   });
  //   const savedTeacher = await this.teacherRepository.save(teacher);

  //   // 3. Create the address, linked to that Teacher
  //   const address = this.dataSource.getRepository(TeacherAddress).create({
  //     teacher_id: savedTeacher.id,
  //     address: dto.address,
  //     pin_code: dto.pin_code,
  //   });
  //   await this.dataSource.getRepository(TeacherAddress).save(address);

  //   // Re-fetch so the response includes the eager-loaded address relation
  //   return this.findOne(savedTeacher.id);
  // }

  

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

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  // 1. Create the linked User account — plain insert, NOT part of any transaction
  const user = this.dataSource.getRepository(User).create({
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    password: hashedPassword,
    role: UserRole.TEACHER,
    // role: 'teacher',
  });
  const savedUser = await this.dataSource.getRepository(User).save(user);



  // 2. Teacher + TeacherAddress — these two must succeed or fail together
  const savedTeacher = await this.dataSource.transaction(async (manager) => {
    const teacher = manager.create(Teacher, {
      employee_code: dto.employee_code,
      subject: dto.subject,
      qualification: dto.qualification,
      experience: dto.experience,
      user_id: savedUser.id,
    });
    const teacherResult = await manager.save(teacher);

    const address = manager.create(TeacherAddress, {
      teacher_id: teacherResult.id,
      address: dto.address,
      pin_code: dto.pin_code,
    });
    await manager.save(address);

    return teacherResult;
  });

  // Re-fetch so the response includes the eager-loaded address relation
  return this.findOne(savedTeacher.id);
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

    const { name, email, phone, password, address, pin_code, ...teacherFields } = dto;

    if (name || email || phone || password) {
      const userUpdate: Partial<User> = {};
      if (name) userUpdate.name = name;
      if (email) userUpdate.email = email;
      if (phone) userUpdate.phone = phone;
      if (password) userUpdate.password = await bcrypt.hash(password, 10);

      await this.dataSource.getRepository(User).update(teacher.user_id, userUpdate);
    }

    if (Object.keys(teacherFields).length > 0) {
      await this.teacherRepository.update(id, teacherFields);
    }

    if (address || pin_code) {
      const addressUpdate: Partial<TeacherAddress> = {};
      if (address) addressUpdate.address = address;
      if (pin_code) addressUpdate.pin_code = pin_code;

      await this.dataSource
        .getRepository(TeacherAddress)
        .update({ teacher_id: id }, addressUpdate);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const teacher = await this.findOne(id);
    await this.teacherRepository.remove(teacher);
  }
}
















































// import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { Teacher } from './entities/teacher.entity';
// import { User } from '../users/entities/user.entity';
// import { CreateTeacherDto } from './dto/create-teacher.dto';
// import { UserRole } from 'src/users/users_enum/users.enum';
// import { UpdateTeacherDto } from './dto/update-teacher.dto';

// @Injectable()
// export class TeachersService {
//   constructor(
//     @InjectRepository(Teacher)
//     private readonly teacherRepository: Repository<Teacher>,
//     private readonly dataSource: DataSource,
//   ) {}

//   async create(dto: CreateTeacherDto): Promise<Teacher> {
//     // const existingUser = await this.dataSource
//     //   .getRepository(User)
//     //   .findOne({ where: { email: dto.email } });
 
//     // if (existingUser) {
//     //   throw new ConflictException('Email already in use');
//     // }

//     const existingTeacher = await this.dataSource
//       .getRepository(Teacher)
//       .findOne({ where: { employee_code: dto.employee_code } });

//     if (existingTeacher) {
//       throw new ConflictException('Employee code already in use');
//     }


//     return this.dataSource.transaction(async (manager) => {
//       const hashedPassword = await bcrypt.hash(dto.password, 10);

//       const user = manager.create(User, {
//         name: dto.name,
//         email: dto.email,
//         phone: dto.phone,
//         password: hashedPassword,
//         role: UserRole.TEACHER,
//       });
//       const savedUser = await manager.save(user);

//       const teacher = manager.create(Teacher, {
//         employee_code: dto.employee_code,
//         subject: dto.subject,
//         qualification: dto.qualification,
//         experience: dto.experience,
//         user_id: savedUser.id,
//       });

//       return manager.save(teacher);
//     });
//   }

//   async findAll(): Promise<Teacher[]> {
//     return this.teacherRepository.find({
//       order: { id: 'ASC' },
//     });
//   }

//   async findOne(id: number): Promise<Teacher> {
//     const teacher = await this.teacherRepository.findOne({ where: { id } });
//     if (!teacher) {
//       throw new NotFoundException(`Teacher with id ${id} not found`);
//     }
//     return teacher;
//   }


// async update(id: number, dto: UpdateTeacherDto): Promise<Teacher> {
//   const teacher = await this.findOne(id);

//   const { name, email, phone, password, ...teacherFields } = dto;

//   return this.dataSource.transaction(async (manager) => {
//     if (name || email || phone || password) {
//       const userUpdate: Partial<User> = {};
//       if (name) userUpdate.name = name;
//       if (email) userUpdate.email = email;
//       if (phone) userUpdate.phone = phone;
//       if (password) userUpdate.password = await bcrypt.hash(password, 10);

//       await manager.update(User, teacher.user_id, userUpdate);
//     }

//     if (Object.keys(teacherFields).length > 0) {
//       await manager.update(Teacher, id, teacherFields);
//     }

//     const updatedTeacher = await manager.findOne(Teacher, { where: { id } });

//     if (!updatedTeacher) {
//       throw new NotFoundException(`Teacher with id ${id} not found`);
//     }

//     return updatedTeacher;
//   });
// }


//   async remove(id: number): Promise<void> {
//     const teacher = await this.findOne(id);
//     await this.teacherRepository.remove(teacher);
//   }

// }








// import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { Teacher } from './entities/teacher.entity';
// import { User } from '../users/entities/user.entity';
// import { CreateTeacherDto } from './dto/create-teacher.dto';
// import { UserRole } from 'src/users/users_enum/users.enum';
// import { UpdateTeacherDto } from './dto/update-teacher.dto';

// @Injectable()
// export class TeachersService {
//   constructor(
//     @InjectRepository(Teacher)
//     private readonly teacherRepository: Repository<Teacher>,
//     private readonly dataSource: DataSource,
//   ) {}

//   // async create(dto: CreateTeacherDto): Promise<Teacher> {
//   //   const existingUser = await this.dataSource
//   //     .getRepository(User)
//   //     .findOne({ where: { email: dto.email } });

//   //   if (existingUser) {
//   //     throw new ConflictException('Email already in use');
//   //   }

//   //   // temp
//   //   // const existingTeacher = await this.dataSource
//   //   //   .getRepository(Teacher)
//   //   //   .findOne({ where: { employee_code: dto.employee_code } });
//   //   //
//   //   // if (existingTeacher) {
//   //   //   throw new ConflictException('Employee code already in use');
//   //   // }

//   //   return this.dataSource.transaction(async (manager) => {
//   //     const hashedPassword = await bcrypt.hash(dto.password, 10);

//   //     const user = manager.create(User, {
//   //       name: dto.name,
//   //       email: dto.email,
//   //       phone: dto.phone,
//   //       password: hashedPassword,
//   //       // role: UserRole.TEACHER,
//   //     });
//   //     const savedUser = await manager.save(user);

//   //     const teacher = manager.create(Teacher, {
//   //       employee_code: dto.employee_code,
//   //       subject: dto.subject,
//   //       qualification: dto.qualification,
//   //       experience: dto.experience,
//   //       user_id: savedUser.id,
//   //     });

//   //     return manager.save(teacher);
//   //   });
//   // }

//   async create(dto: CreateTeacherDto): Promise<Teacher> {
//   const existingUser = await this.dataSource
//     .getRepository(User)
//     .findOne({ where: { email: dto.email } });

//   if (existingUser) {
//     throw new ConflictException('Email already in use');
//   }

//   const existingTeacher = await this.dataSource
//     .getRepository(Teacher)
//     .findOne({ where: { employee_code: dto.employee_code } });

//   if (existingTeacher) {
//     throw new ConflictException('Employee code already in use');
//   }

//   const hashedPassword = await bcrypt.hash(dto.password, 10);

//   const user = this.dataSource.getRepository(User).create({
//     name: dto.name,
//     email: dto.email,
//     phone: dto.phone,
//     password: hashedPassword,
//   });
//   const savedUser = await this.dataSource.getRepository(User).save(user);

//   const teacher = this.teacherRepository.create({
//     employee_code: dto.employee_code,
//     subject: dto.subject,
//     qualification: dto.qualification,
//     experience: dto.experience,
//     user_id: savedUser.id,
//   });

//   return this.teacherRepository.save(teacher);
// }

//   async findAll(): Promise<Teacher[]> {
//     return this.teacherRepository.find({
//       order: { id: 'ASC' },
//     });
//   }

//   async findOne(id: number): Promise<Teacher> {
//     const teacher = await this.teacherRepository.findOne({ where: { id } });
//     if (!teacher) {
//       throw new NotFoundException(`Teacher with id ${id} not found`);
//     }
//     return teacher;
//   }

//   // async update(id: number, dto: UpdateTeacherDto): Promise<Teacher> {
//   //   const teacher = await this.findOne(id);

//   //   const { name, email, phone, password, ...teacherFields } = dto;

//   //   return this.dataSource.transaction(async (manager) => {
//   //     if (name || email || phone || password) {
//   //       const userUpdate: Partial<User> = {};
//   //       if (name) userUpdate.name = name;
//   //       if (email) userUpdate.email = email;
//   //       if (phone) userUpdate.phone = phone;
//   //       if (password) userUpdate.password = await bcrypt.hash(password, 10);

//   //       await manager.update(User, teacher.user_id, userUpdate);
//   //     }

//   //     if (Object.keys(teacherFields).length > 0) {
//   //       await manager.update(Teacher, id, teacherFields);
//   //     }

//   //     const updatedTeacher = await manager.findOne(Teacher, { where: { id } });

//   //     if (!updatedTeacher) {
//   //       throw new NotFoundException(`Teacher with id ${id} not found`);
//   //     }

//   //     return updatedTeacher;
//   //   });
//   // }

//   async update(id: number, dto: UpdateTeacherDto): Promise<Teacher> {
//   const teacher = await this.findOne(id);

//   const { name, email, phone, password, ...teacherFields } = dto;

//   if (name || email || phone || password) {
//     const userUpdate: Partial<User> = {};
//     if (name) userUpdate.name = name;
//     if (email) userUpdate.email = email;
//     if (phone) userUpdate.phone = phone;
//     if (password) userUpdate.password = await bcrypt.hash(password, 10);

//     await this.dataSource.getRepository(User).update(teacher.user_id, userUpdate);
//   }

//   if (Object.keys(teacherFields).length > 0) {
//     await this.teacherRepository.update(id, teacherFields);
//   }

//   const updatedTeacher = await this.teacherRepository.findOne({ where: { id } });

//   if (!updatedTeacher) {
//     throw new NotFoundException(`Teacher with id ${id} not found`);
//   }

//   return updatedTeacher;
// }

//   async remove(id: number): Promise<void> {
//     const teacher = await this.findOne(id);
//     await this.teacherRepository.remove(teacher);
//   }
// }





























// import {
//   Injectable,
//   NotFoundException,
//   ConflictException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { Teacher } from './entities/teacher.entity';
// import { TeacherAddress } from './entities/teacher-address.entity';
// import { User } from '../users/entities/user.entity';
// import { CreateTeacherDto } from './dto/create-teacher.dto';
// import { UpdateTeacherDto } from './dto/update-teacher.dto';
// import { UserRole } from 'src/users/users_enum/users.enum';

// @Injectable()
// export class TeachersService {
//   constructor(
//     @InjectRepository(Teacher)
//     private readonly teacherRepository: Repository<Teacher>,
//     private readonly dataSource: DataSource,
//   ) {}

//   // async create(dto: CreateTeacherDto): Promise<Teacher> {
//   //   const existingUser = await this.dataSource
//   //     .getRepository(User)
//   //     .findOne({ where: { email: dto.email } });

//   //   if (existingUser) {
//   //     throw new ConflictException('Email already in use');
//   //   }

//   //   const existingTeacher = await this.dataSource
//   //     .getRepository(Teacher)
//   //     .findOne({ where: { employee_code: dto.employee_code } });

//   //   if (existingTeacher) {
//   //     throw new ConflictException('Employee code already in use');
//   //   }

//   //   const hashedPassword = await bcrypt.hash(dto.password, 10);

//   //   // 1. Create the linked User account (role is always 'teacher' here —
//   //   // never taken from client input, since this endpoint IS the source
//   //   // of truth for "this person is a teacher")
//   //   const user = this.dataSource.getRepository(User).create({
//   //     name: dto.name,
//   //     email: dto.email,
//   //     phone: dto.phone,
//   //     password: hashedPassword,
//   //     role: UserRole.TEACHER,
//   //   });
//   //   const savedUser = await this.dataSource.getRepository(User).save(user);

//   //   // 2. Create the Teacher profile, linked to that User
//   //   const teacher = this.teacherRepository.create({
//   //     employee_code: dto.employee_code,
//   //     subject: dto.subject,
//   //     qualification: dto.qualification,
//   //     experience: dto.experience,
//   //     user_id: savedUser.id,
//   //   });
//   //   const savedTeacher = await this.teacherRepository.save(teacher);

//   //   // 3. Create the address, linked to that Teacher
//   //   const address = this.dataSource.getRepository(TeacherAddress).create({
//   //     teacher_id: savedTeacher.id,
//   //     address: dto.address,
//   //     pin_code: dto.pin_code,
//   //   });
//   //   await this.dataSource.getRepository(TeacherAddress).save(address);

//   //   // Re-fetch so the response includes the eager-loaded address relation
//   //   return this.findOne(savedTeacher.id);
//   // }

// async create(dto: CreateTeacherDto): Promise<Teacher> {
//   const existingUser = await this.dataSource
//     .getRepository(User)
//     .findOne({ where: { email: dto.email } });

//   if (existingUser) {
//     throw new ConflictException('Email already in use');
//   }

//   const existingTeacher = await this.dataSource
//     .getRepository(Teacher)
//     .findOne({ where: { employee_code: dto.employee_code } });

//   if (existingTeacher) {
//     throw new ConflictException('Employee code already in use');
//   }

//   const hashedPassword = await bcrypt.hash(dto.password, 10);

//   const user = this.dataSource.getRepository(User).create({
//     name: dto.name,
//     email: dto.email,
//     phone: dto.phone,
//     password: hashedPassword,
//     role: UserRole.TEACHER,
//   });
//   const savedUser = await this.dataSource.getRepository(User).save(user);

//   const teacher = this.teacherRepository.create({
//     employee_code: dto.employee_code,
//     subject: dto.subject,
//     qualification: dto.qualification,
//     experience: dto.experience,
//     user_id: savedUser.id,
//   });
//   const savedTeacher = await this.teacherRepository.save(teacher);

//   const address = this.dataSource.getRepository(TeacherAddress).create({
//     teacher_id: savedTeacher.id,
//     address: dto.address,
//     pin_code: dto.pin_code,
//   });
//   await this.dataSource.getRepository(TeacherAddress).save(address);

//   return this.findOne(savedTeacher.id);
// } 

//   async findAll(): Promise<Teacher[]> {
//     return this.teacherRepository.find({
//       order: { id: 'ASC' },
//     });
//   }

//   async findOne(id: number): Promise<Teacher> {
//     const teacher = await this.teacherRepository.findOne({ where: { id } });
//     if (!teacher) {
//       throw new NotFoundException(`Teacher with id ${id} not found`);
//     }
//     return teacher;
//   }

//   async update(id: number, dto: UpdateTeacherDto): Promise<Teacher> {
//     const teacher = await this.findOne(id);

//     const { name, email, phone, password, address, pin_code, ...teacherFields } = dto;

//     if (name || email || phone || password) {
//       const userUpdate: Partial<User> = {};
//       if (name) userUpdate.name = name;
//       if (email) userUpdate.email = email;
//       if (phone) userUpdate.phone = phone;
//       if (password) userUpdate.password = await bcrypt.hash(password, 10);

//       await this.dataSource.getRepository(User).update(teacher.user_id, userUpdate);
//     }

//     if (Object.keys(teacherFields).length > 0) {
//       await this.teacherRepository.update(id, teacherFields);
//     }

//     if (address || pin_code) {
//       const addressUpdate: Partial<TeacherAddress> = {};
//       if (address) addressUpdate.address = address;
//       if (pin_code) addressUpdate.pin_code = pin_code;

//       await this.dataSource
//         .getRepository(TeacherAddress)
//         .update({ teacher_id: id }, addressUpdate);
//     }

//     return this.findOne(id);
//   }

//   async remove(id: number): Promise<void> {
//     const teacher = await this.findOne(id);
//     await this.teacherRepository.remove(teacher);
//   }
// }

































