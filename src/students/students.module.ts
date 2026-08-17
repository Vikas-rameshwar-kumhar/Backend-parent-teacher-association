


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Parent } from '../parents/entities/parent.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Teacher, Parent]),
    AuthModule,
  ],
  providers: [StudentsService],
  controllers: [StudentsController],
})
export class StudentsModule {}
