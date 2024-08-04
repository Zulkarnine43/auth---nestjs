import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddOrderProductDto {
  @IsNotEmpty()
  @IsNumber()
  skuId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  custom_sizes: { key: string; value: string }[];
}
