// import { ApiProperty, OmitType } from '@nestjs/swagger';
// import {
//   IsString,
//   IsNotEmpty,
//   IsInt,
//   Min,
// } from 'class-validator';
// import { CreateUserDto } from 'src/users/dto/create-user.dto';

// // export class CreateTeacherDto {
// export class CreateTeacherDto extends OmitType(CreateUserDto, ['role'] as const) {
//   // --- User fields --- name, email, phone, password



//   // --- Teacher-specific fields ---
//   @ApiProperty({ example: 'EMP-2024-001' })
//   @IsString()
//   @IsNotEmpty()
//   employee_code: string;

//   @ApiProperty({ example: 'Mathematics' })
//   @IsString()
//   @IsNotEmpty()
//   subject: string;

//   @ApiProperty({ example: 'M.Sc Mathematics' })
//   @IsString()
//   @IsNotEmpty()
//   qualification: string;

//   @ApiProperty({ example: 5 })
//   @IsInt()
//   @Min(0)
//   experience: number;
// }





import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  Min,
  Max,
  MinLength,
} from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'janedoe@school.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'EMP-2024-001' })
  @IsString()
  @IsNotEmpty()
  employee_code: string;

  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'M.Sc Mathematics' })
  @IsString()
  @IsNotEmpty()
  qualification: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  experience: number;

  @ApiProperty({ example: '123 Main Street, Bengaluru' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 560076 })
  @IsInt({ message: 'pin_code must be a 6-digit number' })
  @Min(100000, { message: 'pin_code must be a 6-digit number' })
  @Max(999999, { message: 'pin_code must be a 6-digit number' })
  pin_code: number;
}