import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderProduct } from './order-product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderProductAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderProduct, (orderProduct) => orderProduct.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_product_id' })
  orderProduct: Order;

  @Column({ type: 'bigint', name: 'order_product_id', nullable: false })
  orderProductId: number;

  @Column({ type: 'varchar', nullable: false })
  key: string;

  @Column({ type: 'varchar', nullable: false })
  value: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
