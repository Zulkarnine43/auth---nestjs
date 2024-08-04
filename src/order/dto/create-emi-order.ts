import { IsOptional, IsString } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

export class CreateEmiOrderDto extends CreateOrderDto {
  @IsOptional()
  @IsString()
  tenures: string;
}
