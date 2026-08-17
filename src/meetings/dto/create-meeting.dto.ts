import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsIn,
  Matches,
} from 'class-validator';

export class CreateMeetingDto {
  @ApiProperty({ example: 'Parent-Teacher Meeting - Term 1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Discussion on term 1 academic performance',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-09-10' })
  @IsDateString()
  @IsNotEmpty()
  meeting_date: string;

  @ApiProperty({ example: '14:30' })
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'meeting_time must be in HH:mm format (24-hour)',
  })
  meeting_time: string;

  @ApiProperty({ example: 'offline', enum: ['online', 'offline'] })
  @IsIn(['online', 'offline'])
  @IsNotEmpty()
  mode: string;

  @ApiProperty({
    example: 'scheduled',
    enum: ['scheduled', 'completed', 'cancelled'],
    required: false,
  })
  @IsOptional()
  @IsIn(['scheduled', 'completed', 'cancelled'])
  status?: string;
}