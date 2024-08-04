import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderNoteDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
