import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerLoginDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  phone: string;

  @ApiProperty({required: true})
  @IsNotEmpty()
  password: string;
}
