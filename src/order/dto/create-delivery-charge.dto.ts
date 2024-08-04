import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { DeliveryChargeType } from '../entities/delivery-charge.entity';

export class CreateDeliveryChargeDto {
  @IsNotEmpty()
  @IsEnum(DeliveryChargeType)
  type: DeliveryChargeType;

  @IsOptional()
  cityId: number;

  @IsNotEmpty()
  charge: number;
}
