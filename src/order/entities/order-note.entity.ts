import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { User } from '../../user/entities/user.entity';
import { Order } from './order.entity';

export enum OrderNoteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class OrderNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', name: 'user_id', nullable: true })
  userId: number;

  @Column({ type: 'bigint', name: 'order_id', nullable: true })
  orderId: number;

  @Column({ type: 'longtext', name: 'message', nullable: true })
  message: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => Order, (item) => item.orderNote)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  // @OneToOne(() => User, (item) => item.orderNote)
  // @JoinColumn({ name: 'user_id' })
  // user: User;
}
