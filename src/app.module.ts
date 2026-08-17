// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}



import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import typeorm from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';
import { ParentsModule } from './parents/parents.module';
import { StudentsModule } from './students/students.module';
import { MeetingsService } from './meetings/meetings.service';
import { MeetingsController } from './meetings/meetings.controller';
import { MeetingsModule } from './meetings/meetings.module';


@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [typeorm],
    // }),
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
  // providers: [MeetingsService],
  // controllers: [MeetingsController],
})
export class AppModule {}




// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: 'password',
//       database: 'nestdb',
//       autoLoadEntities: true,
//       synchronize: true,
//     }),
//   ],
// })
// export class AppModule {}




// npm install @nestjs/typeorm typeorm pg
// npm install @nestjs/config
// npm install class-validator class-transformer
// npm install @nestjs/jwt @nestjs/passport passport passport-jwt
// npm install bcrypt
// npm install @nestjs/swagger




// npm install dotenv
// npm install -D ts-node