import { IsInt, Min } from 'class-validator';

export class CreateMeetingDto {
  @IsInt()
  @Min(1)
  roomId: number;
}
