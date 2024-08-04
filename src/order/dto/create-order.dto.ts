import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class OrderProduct {
  @IsNotEmpty()
  skuId: number;
  @IsNotEmpty()
  productId: number;
  @IsNotEmpty()
  quantity: number;
  @IsNotEmpty()
  sku: string;
  @IsOptional()
  custom_sizes: { key: string; value: string }[];
  // @IsOptional()
  // customeSize: boolean;
  // @IsOptional()
  // mainMeasurement: string;
  // @IsOptional()
  // measurementSize: string;
  @IsOptional()
  attributes: { key: string; value: string }[];
  @IsOptional()
  discount: boolean;
}
export class CreateOrderDto {
  @IsOptional()
  shippingName: string;
  @IsOptional()
  shippingPhone: string;
  @IsOptional()
  shippingEmail: string;
  @IsOptional()
  shippingCountryId: number;
  @IsOptional()
  shippingCityId: number;
  @IsOptional()
  shippingThanaId: number;
  @IsOptional()
  shippingAreaId: number;
  @IsOptional()
  shippingStreet: string;
  @IsOptional()
  shippingPostalCode: string;
  @IsOptional()
  shippingLat: number;
  @IsOptional()
  shippingLon: number;

  @IsOptional()
  billingName: string;
  @IsOptional()
  billingPhone: string;
  @IsOptional()
  billingEmail: string;
  @IsOptional()
  billingCountryId: number;
  @IsOptional()
  billingCityId: number;
  @IsOptional()
  billingThanaId: number;
  @IsOptional()
  billingAreaId: number;
  @IsOptional()
  billingStreet: string;
  @IsOptional()
  billingPostalCode: string;
  @IsOptional()
  billingLat: number;
  @IsOptional()
  billingLon: number;

  @IsOptional()
  @IsString()
  additionalPhone: string;

  @IsOptional()
  note: string;

  @IsOptional()
  type: string;
  @IsOptional()
  shopId: number;

  @IsOptional()
  paymentMethod: string;
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderProduct)
  products: OrderProduct[];

  @IsOptional()
  @IsNumber()
  offerId: number;
}
