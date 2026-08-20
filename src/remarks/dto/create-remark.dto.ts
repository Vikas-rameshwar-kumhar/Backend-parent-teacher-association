import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateRemarkDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  student_id: number;

  @ApiProperty({ example: 'Shows great improvement in Mathematics this term.' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 1000)
  remark: string;
}