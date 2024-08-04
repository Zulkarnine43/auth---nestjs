import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderTimeline {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (item) => item.timeline, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'bigint', name: 'order_id', nullable: false })
  orderId: number;

  @Column({ type: 'varchar', nullable: false })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
