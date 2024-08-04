import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderNoteDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  message: string;
}
