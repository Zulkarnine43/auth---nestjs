// import { City } from '../../address/entities/city.entity';
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

export enum DeliveryChargeType {
  INSIDE_DHAKA = 'inside_dhaka',
  OUTSIDE_DHAKA = 'outside_dhaka',
  CUSTOM = 'custom',
}

@Entity()
export class DeliveryCharge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: DeliveryChargeType, nullable: false })
  type: DeliveryChargeType;

  // @OneToOne(() => City, (city) => city.deliveryCharge, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'city_id' })
  // city: City;

  @Column({ type: 'bigint', name: 'city_id', nullable: true })
  cityId: number;

  @Column({ type: 'double', nullable: false })
  charge: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
