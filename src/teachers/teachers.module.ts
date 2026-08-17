// import { Module } from '@nestjs/common';
// import { TeachersService } from './teachers.service';
// import { TeachersController } from './teachers.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Teacher } from './entities/teacher.entity';
// import { AuthModule } from 'src/auth/auth.module';
// import { UsersModule } from 'src/users/users.module';

// @Module({
//   imports: [TypeOrmModule.forFeature([Teacher]), AuthModule, UsersModule],
//   providers: [TeachersService],
//   controllers: [TeachersController]
// })
// export class TeachersModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { Teacher } from './entities/teacher.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher]), AuthModule, UsersModule],
  providers: [TeachersService],
  controllers: [TeachersController],
})
export class TeachersModule {}
