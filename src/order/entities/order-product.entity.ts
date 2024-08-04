import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { Brand } from '../../brand/entities/brand.entity';
// import { Category } from '../../category/entities/category.entity';
// import { Product } from '../../product/entities/product.entity';
// import { Sku } from '../../product/entities/sku.entity';
// import { Warehouse } from '../../warehouse/entities/warehouse.entity';
import { OrderProductAttribute } from './order-product-attribute.entity';
import { Order } from './order.entity';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'bigint', name: 'order_id', nullable: false })
  orderId: number;

  // @ManyToOne(() => Product, (product) => product.orders)
  // @JoinColumn({ name: 'product_id' })
  // product: Product;

  @Column({ type: 'bigint', name: 'product_id', nullable: false })
  productId: number;

  // @ManyToOne(() => Sku, (product) => product.orders)
  // @JoinColumn({ name: 'sku_id' })
  // variation: Product;

  @Column({ type: 'bigint', name: 'sku_id', nullable: false })
  skuId: number;

  // @ManyToOne(() => Brand, (brand) => brand.orders)
  // @JoinColumn({ name: 'brand_id' })
  // brand: Brand;

  @Column({ type: 'bigint', name: 'brand_id', nullable: true })
  brandId: number;

  // @ManyToOne(() => Category, (item) => item.orders)
  // @JoinColumn({ name: 'category_id' })
  // category: Category;

  @Column({ type: 'bigint', name: 'category_id', nullable: true })
  categoryId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  sku: string;

  @Column({ type: 'varchar', name: 'custom_sku', length: 100, nullable: true })
  customSku: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail: string;

  @Column({ type: 'double', name: 'purchase_price', nullable: true })
  purchasePrice: number;

  @Column({ type: 'double', nullable: false })
  price: number;

  @Column({ type: 'double', name: 'discounted_price', nullable: false })
  discountedPrice: number;

  @Column({ type: 'integer', name: 'quantity', nullable: false })
  quantity: number;

  @Column({ type: 'double', name: 'total_price', nullable: false })
  totalPrice: number;

  @Column({ type: 'double', name: 'vat', nullable: true })
  vat: number;

  @Column({ type: 'longtext', name: 'gng_gift', nullable: true })
  gng_gift: string;

  @Column({ type: 'longtext', name: 'brand_gift', nullable: true })
  brand_gift: string;

  @Column({ type: 'longtext', name: 'custom_sizes', nullable: true })
  custom_sizes: string;

  @Column({ type: 'boolean', default: true, name: 'discount' })
  discount: boolean;

  // @Column({ type: 'longtext', name: 'main_measurement', nullable: true })
  // mainMeasurement: string;

  // @Column({ type: 'longtext', name: 'measurement_size', nullable: true })
  // measurementSize: string;

  @Column({ type: 'longtext', name: 'custome_size', nullable: true })
  customeSize: string;

  @Column({ type: 'boolean', default: false, name: 'order_confirm' })
  orderConfirm: boolean;

  @Column({
    type: 'varchar',
    name: 'warranty_type',
    length: 255,
    nullable: true,
  })
  warrantyType: string;

  @Column({ type: 'varchar', name: 'warranty', length: 255, nullable: true })
  warranty: string;

  @Column({ type: 'varchar', nullable: false })
  status: string;

  @Column({ type: 'text', nullable: true })
  orderNumber: string;

  @Column({ type: 'bigint', name: 'warehouse_id', nullable: true })
  warehouseId: number;

  // @ManyToOne(() => Warehouse, (warehouse) => warehouse.orderProducts, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'warehouse_id' })
  // warehouse: Warehouse;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => OrderProductAttribute, (attribute) => attribute.orderProduct)
  attributes: OrderProductAttribute[];
}
