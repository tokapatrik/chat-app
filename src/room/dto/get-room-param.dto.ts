import { IsUUID } from 'class-validator';

export class GetRoomParamDto {
  @IsUUID()
  readonly id: string;
}
