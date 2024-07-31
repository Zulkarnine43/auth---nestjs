import { IsEmail, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  orderNumber: string;

  @IsString()
  link: string;
}
