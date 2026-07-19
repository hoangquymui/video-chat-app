import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100)
  name?: string;
  @IsOptional() @IsEmail() @MaxLength(150)
  email?: string;
  @IsOptional() @IsString() @MinLength(6) @MaxLength(128)
  password?: string;
  @IsOptional() @IsIn(['admin', 'user'])
  role?: string;
}
