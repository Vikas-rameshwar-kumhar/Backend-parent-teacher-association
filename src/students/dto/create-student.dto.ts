import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsDateString,
  IsInt,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Rahul Sharma' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  student_name: string;

  @ApiProperty({ example: '10' })
  @IsString()
  @IsNotEmpty()
  class: string;

  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  section: string;

  @ApiProperty({ example: 'R2026001' })
  @IsString()
  @IsNotEmpty()
  roll_number: string;

  @ApiProperty({ example: '2012-05-14' })
  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @ApiProperty({ example: 'male' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  teacher_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  parent_id: number;

  @ApiProperty({ example: 'active', required: false })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;
}