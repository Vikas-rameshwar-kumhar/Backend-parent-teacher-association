import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemarksService } from './remarks.service';
import { RemarksController } from './remarks.controller';
import { Remark } from './entities/remark.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { AuthModule } from '../auth/auth.module';
import { Parent } from 'src/parents/entities/parent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Remark, Student, Teacher, Parent]),
    AuthModule,
  ],
  controllers: [RemarksController],
  providers: [RemarksService],
  exports: [RemarksService],
})
export class RemarksModule {}
