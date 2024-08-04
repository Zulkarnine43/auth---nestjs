import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DeliveryChargeType } from '../entities/delivery-charge.entity';

export class TrackMyOrderDto {
  @IsNotEmpty()
  @IsString()
  orderNumber: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}
