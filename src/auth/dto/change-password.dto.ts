import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldSecret123' })
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({ example: 'newSecret456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  new_password: string;
}