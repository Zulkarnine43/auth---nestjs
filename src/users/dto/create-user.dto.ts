import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Gender } from '../entities/user.entity';

export class CreateAdminDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  adminType: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  password: string;
}

export class CreateCustomerDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  password: string;
}
