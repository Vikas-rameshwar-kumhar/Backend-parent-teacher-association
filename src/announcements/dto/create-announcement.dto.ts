import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'School Reopens on 1st September' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  title: string;

  @ApiProperty({
    example: 'The school will reopen for Term 2 on 1st September 2026.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}