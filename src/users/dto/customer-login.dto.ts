import { IsNotEmpty } from 'class-validator';

export class CustomerLoginDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  password: string;
}
