import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString() @MinLength(1) @MaxLength(100)
  name!: string;
  @IsEmail() @MaxLength(150)
  email!: string;
  @IsString() @MinLength(6) @MaxLength(128)
  password!: string;
  @IsOptional() @IsIn(['admin', 'user'])
  role?: string;
}
