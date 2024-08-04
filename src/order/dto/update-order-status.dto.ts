import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  // @IsEnum(OrderProductStatus)
  @IsString()
  status: string;
}
