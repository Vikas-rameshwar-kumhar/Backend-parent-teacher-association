

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import typeorm from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';
import { ParentsModule } from './parents/parents.module';
import { StudentsModule } from './students/students.module';
import { MeetingsModule } from './meetings/meetings.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [

    ConfigModule.forRoot({
  isGlobal: true,
  load: [typeorm],
  validate: (config) => {
    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in .env');
    }
    if (!config.JWT_EXPIRES_IN) {
      throw new Error('JWT_EXPIRES_IN is not defined in .env');
    }
    return config;
  },
}),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get('typeorm') as any,
    }),
    UsersModule,
    AuthModule,
    TeachersModule,
    ParentsModule,
    StudentsModule,
    MeetingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],


})
export class AppModule {}




