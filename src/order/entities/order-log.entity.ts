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
import { Order } from './order.entity';
import { User } from 'src/users/entities/user.entity';

export enum OrderLogStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class OrderLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', name: 'user_id', nullable: true })
  userId: number;

  @Column({ type: 'bigint', name: 'order_id', nullable: true })
  orderId: number;

  @Column({ type: 'varchar', name: 'type', nullable: true })
  type: string;

  @Column({ type: 'longtext', name: 'message', nullable: true })
  message: string;

  @Column({ type: 'longtext', name: 'old_data', nullable: true })
  oldData: string;

  @Column({ type: 'longtext', name: 'new_data', nullable: true })
  newData: string;

  @Column({
    type: 'varchar',
    name: 'status',
    nullable: false,
    default: OrderLogStatus.ACTIVE,
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => Order, (item) => item.orderLog)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  // @OneToOne(() => User, (item) => item.orderLog)
  // @JoinColumn({ name: 'user_id' })
  // user: User;
}
