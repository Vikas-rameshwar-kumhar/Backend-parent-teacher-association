// import {
//   IsString,
//   IsEmail,
//   IsNotEmpty,
//   IsEnum,
//   Length,
//   Matches,

// } from 'class-validator';
// import { UserRole } from '../entities/user.entity';

// export class CreateUserDto {
//   @IsString()
//   @IsNotEmpty()
//   @Length(2, 100)
//   name: string;

//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   @Matches(/^\+91[0-9]{10}$/, {
//     message: 'Phone must be in the format +91 followed by 10 digits',
//   })
//   phone: string;

//   @IsString()
//   @IsNotEmpty()
//   @Length(6, 255)
//   password: string;

//   @IsEnum(UserRole, { message: 'Role must be admin, teacher, or parent' })
//   role: UserRole;


// }




  

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  Length,
  Matches,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../users_enum/users.enum';



export class CreateUserDto {
  @ApiProperty({ example: 'Admin One' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: 'admin@school.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+919876543210' })
  @Matches(/^\+91[0-9]{10}$/, {
    message: 'Phone must be in the format +91 followed by 10 digits',
  })
  phone: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  // @IsStrongPassword()
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  @IsEnum(UserRole, { message: 'Role must be admin' })
  role: UserRole;
}