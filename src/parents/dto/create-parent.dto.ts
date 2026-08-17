import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateParentDto extends OmitType(CreateUserDto, ['role'] as const) {
  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @IsNotEmpty()
  occupation: string;

  @ApiProperty({ example: '123 Main Street, Bengaluru' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Father' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  relation: string;
}