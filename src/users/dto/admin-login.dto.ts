import { IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
