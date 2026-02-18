import { IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  roomId: string;

  @IsString()
  text: string;
}
