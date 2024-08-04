import { IsNotEmpty, IsOptional } from 'class-validator';

export class ShippingAddressUpdateDto {
  @IsOptional()
  shippingName: string;
  @IsOptional()
  shippingPhone: string;
  @IsOptional()
  shippingEmail: string;
  @IsOptional()
  shippingCountry: string;
  @IsOptional()
  shippingCity: string;
  @IsOptional()
  shippingThana: string;
  @IsOptional()
  shippingArea: string;
  @IsOptional()
  shippingStreet: string;
  @IsOptional()
  shippingPostalCode: string;
  @IsOptional()
  shippingLat: number;
  @IsOptional()
  shippingLon: number;
}