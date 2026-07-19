import { ArrayMaxSize, ArrayUnique, IsArray, IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  name: string;

  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(100)
  @IsInt({ each: true })
  memberIds: number[];
}
