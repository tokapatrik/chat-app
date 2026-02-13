import { IsString, Length } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @Length(1, 20)
  readonly name: string;

  @IsString()
  @Length(1, 60)
  readonly description: string;
}
