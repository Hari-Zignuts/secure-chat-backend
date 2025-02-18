import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password@123',
    description: 'User password',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Hari Malam', description: 'User name' })
  @IsOptional()
  name: string;
}
