import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderProductDto {
  @IsNotEmpty()
  @IsString()
  status: string;
}

export class UpdateOrderProductQtyDto {
  @IsOptional()
  @IsNumber()
  qty: number;

  @IsOptional()
  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  unitQuantityPrice: number;

  @IsOptional()
  @IsNumber()
  totalAmount: number;
}
