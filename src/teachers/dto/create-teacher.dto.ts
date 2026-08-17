import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

// export class CreateTeacherDto {
export class CreateTeacherDto extends OmitType(CreateUserDto, ['role'] as const) {
  // --- User fields --- name, email, phone, password



  // --- Teacher-specific fields ---
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
}
