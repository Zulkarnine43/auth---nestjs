import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDeliveryChargeDto {
  @IsNotEmpty()
  charge: number;
}

export class UpdateDeliveryChargesDto {
  @IsNotEmpty()
  @IsNumber()
  deliveryCharge: number;
}
