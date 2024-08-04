import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { Offer } from '../../offer/entities/offer.entity';
// import { Payment } from '../../payment/entities/payment.entity';
// import { User } from '../../user/entities/user.entity';
import { OrderLog } from './order-log.entity';
import { OrderNote } from './order-note.entity';
import { OrderProduct } from './order-product.entity';
import { OrderTimeline } from './order-timeline.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  UNPAID = 'unpaid',
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'COD',
  SSLCOMMERZ = 'sslcommerz',
  BKASH = 'bkash',
  ROCKET = 'rocket',
  NAGAD = 'nagad',
  UPAY = 'upay',
  UCB = 'UCB',
  BANK_TRANSFER = 'bank_transfer',
  PORTPOS = 'portpos',
}
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'order_number',
    length: 40,
    nullable: false,
  })
  orderNumber: string;

  // @ManyToOne(() => User, (user) => user.orders, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @Column({ type: 'bigint', name: 'user_id', nullable: false })
  userId: number;

  @Column({
    type: 'varchar',
    name: 'type',
    nullable: true,
  })
  type: string;

  @Column({ type: 'double', nullable: true })
  discount: number;

  // @ManyToOne(() => Offer, (offer) => offer.orders, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'offer_id' })
  // offer: Offer;

  @Column({ type: 'bigint', name: 'offer_id', nullable: true })
  offerId: number;

  @Column({ type: 'double', nullable: false })
  subtotal: number;

  @Column({ type: 'double', name: 'delivery_charge', nullable: true })
  deliveryCharge: number;

  @Column({ type: 'double', name: 'grand_total', nullable: false })
  grandTotal: number;

  @Column({ type: 'double', nullable: true, default: 0 })
  paid: number;

  @Column({ type: 'double', nullable: true })
  due: number;

  @Column({
    type: 'varchar',
    name: 'payment_method',
    // enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: string;

  @Column({
    type: 'longtext',
    name: 'cod_info',
    nullable: true,
  })
  codInfo: string;

  @Column({
    type: 'enum',
    name: 'payment_status',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
    nullable: false,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'double', name: 'pre_order_amount', nullable: true })
  preOrderAmount: number;

  @Column({ type: 'bigint', name: 'shop_id', nullable: true })
  shopId: number;

  @Column({ type: 'boolean', name: 'emi', nullable: true })
  emi: boolean;

  @Column({
    type: 'varchar',
    name: 'emi_type',
    nullable: true,
  })
  emiType: string;

  @Column({ type: 'varchar', name: 'emi_tenure', nullable: true, length: 255 })
  emiTenure: string;

  @Column({
    type: 'varchar',
    name: 'emi_selected_month',
    nullable: true,
    length: 255,
  })
  emiSelectedMonth: string;

  // text note
  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({
    type: 'varchar',
    name: 'shipping_name',
    length: 255,
    nullable: true,
  })
  shippingName: string;

  @Column({
    type: 'varchar',
    name: 'shipping_phone',
    length: 255,
    nullable: true,
  })
  shippingPhone: string;

  @Column({
    type: 'varchar',
    name: 'shipping_email',
    length: 255,
    nullable: true,
  })
  shippingEmail: string;

  @Column({
    type: 'varchar',
    name: 'shipping_country',
    length: 255,
    nullable: true,
  })
  shippingCountry: string;

  @Column({
    type: 'varchar',
    name: 'shipping_city',
    length: 255,
    nullable: true,
  })
  shippingCity: string;

  @Column({
    type: 'varchar',
    name: 'shipping_thana',
    length: 255,
    nullable: true,
  })
  shippingThana: string;

  @Column({
    type: 'varchar',
    name: 'shipping_area',
    length: 255,
    nullable: true,
  })
  shippingArea: string;

  @Column({
    type: 'varchar',
    name: 'shipping_street',
    length: 255,
    nullable: true,
  })
  shippingStreet: string;

  @Column({
    type: 'varchar',
    name: 'shipping_postal_code',
    length: 255,
    nullable: true,
  })
  shippingPostalCode: string;

  @Column({ type: 'double', name: 'shipping_lat', nullable: true })
  shippingLat: number;

  @Column({ type: 'double', name: 'shipping_lon', nullable: true })
  shippingLon: number;

  @Column({
    type: 'varchar',
    name: 'billing_name',
    length: 255,
    nullable: true,
  })
  billingName: string;

  @Column({
    type: 'varchar',
    name: 'billing_phone',
    length: 255,
    nullable: true,
  })
  billingPhone: string;

  @Column({
    type: 'varchar',
    name: 'billing_email',
    length: 255,
    nullable: true,
  })
  billingEmail: string;

  @Column({
    type: 'varchar',
    name: 'billing_country',
    length: 255,
    nullable: true,
  })
  billingCountry: string;

  @Column({
    type: 'varchar',
    name: 'billing_city',
    length: 255,
    nullable: true,
  })
  billingCity: string;

  @Column({
    type: 'varchar',
    name: 'billing_thana',
    length: 255,
    nullable: true,
  })
  billingThana: string;

  @Column({
    type: 'varchar',
    name: 'billing_area',
    length: 255,
    nullable: true,
  })
  billingArea: string;

  @Column({
    type: 'varchar',
    name: 'billing_street',
    length: 255,
    nullable: true,
  })
  billingStreet: string;

  @Column({
    type: 'varchar',
    name: 'billing_postal_code',
    length: 255,
    nullable: true,
  })
  billingPostalCode: string;

  @Column({ type: 'double', name: 'billing_lat', nullable: true })
  billingLat: number;

  @Column({ type: 'double', name: 'billing_lon', nullable: true })
  billingLon: number;

  @Column({
    type: 'varchar',
    name: 'order_placed_by_type',
    length: 20,
    default: 'customer',
  })
  orderPlacedByType: string;


  @Column({ type: 'bigint', name: 'order_placed_by_id', nullable: true })
  orderPlacedById: number;

  @Column({
    type: 'varchar',
    name: 'additional_phone',
    length: 20,
    nullable: true
  })
  additionalPhone: string;

  @Column({ type: 'varchar', nullable: false })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => OrderProduct, (product) => product.order)
  products: OrderProduct[];

  @OneToMany(() => OrderTimeline, (item) => item.order)
  timeline: OrderTimeline[];

  // @OneToMany(() => Payment, (item) => item.order)
  // payments: Payment[];

  @OneToOne(() => OrderLog, (item) => item.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  orderLog: OrderLog;

  @OneToOne(() => OrderNote, (item) => item.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  orderNote: OrderNote;
}
