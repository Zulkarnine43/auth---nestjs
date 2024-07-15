import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { json } from 'express';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  shop_id: number;

  @Prop({ type: Object })
  brand: Object;

  @Prop()
  shop_name: string;

  @Prop({ type: Object })
  shop: Object;

  @Prop()
  thumbnail: string;

  @Prop()
  category_id: number;

  @Prop()
  brand_id: number;

  @Prop()
  video_url: string;

  @Prop()
  bn_name: string;

  @Prop()
  slug: string;

  @Prop()
  unit_price: number;

  @Prop()
  discount_price: number;

  @Prop()
  minimum_order_qty: number;

  @Prop()
  maximum_order_qty: number;

  @Prop()
  item_sold: number;

  @Prop()
  free_delivery: boolean;

  @Prop()
  payment_type: string;

  @Prop()
  cash_on_delivery: boolean;

  @Prop()
  partial_payment_amount: number;

  @Prop()
  wholesale: boolean;

  @Prop()
  digital: boolean;

  @Prop()
  emi: boolean;

  @Prop()
  product_type: string;

  @Prop()
  express_delivery: boolean;

  @Prop()
  outside_dhaka: boolean;

  @Prop({ type: json })
  detail: JSON;

  @Prop({ type: json })
  seo: JSON;

  @Prop({ type: json })
  package: JSON;

  @Prop({ type: json })
  warrenty_detail: JSON;

  @Prop()
  images: Array<any>;

  @Prop()
  deliveryCharges: Array<any>;

  @Prop()
  specifications: Array<any>;

  @Prop()
  attributes: Array<any>;

  @Prop()
  skus: Array<any>;

  @Prop()
  campaigns: Array<any>;

  @Prop()
  deliveries: Array<any>;

  @Prop()
  rating: number;

  @Prop()
  reviews: number;

  @Prop()
  visible: string;

  @Prop()
  total_quantity: number;

  @Prop()
  breadcumb: Array<any>;

  @Prop()
  combo_products: Array<any>;

  @Prop()
  cod: boolean;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
