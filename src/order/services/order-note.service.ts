import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderNoteDto } from '../dto/create-order-note.dto';
import { OrderNote } from '../entities/order-note.entity';
import { Order } from '../entities/order.entity';

// order log status
export enum OrderLogStatus {
  ORDER_PLACED = 'Order Placed',
  ORDER_CONFIRMED = 'Order Confirmed',
  ORDER_PROCESSING = 'Order Processing',
  ORDER_SHIPPED = 'Order Shipped',
  ORDER_DELIVERED = 'Order Delivered',
  ORDER_CANCELED = 'Order Canceled',
  ORDER_RETURNED = 'Order Returned',
  ORDER_REFUNDED = 'Order Refunded',
}

@Injectable()
export class OrderNoteService {
  constructor(
    @InjectRepository(OrderNote)
    private orderNoteRepository: Repository<OrderNote>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  select = [
    'order_note.id',
    'order_note.message',
    'order_note.createdAt',
    'user.id',
    'user.firstName',
    'user.lastName',
    'user.email',
    'user.phone',
    'order.id',
    'order.orderNumber',
  ];

  // create order note
  async createOrderNote(user, createOrderNoteDto: CreateOrderNoteDto) {
    try {
      // check order id not exists
      const orderExits = await this.orderRepository.findOne({
        where: {
          id: createOrderNoteDto.orderId,
        },
      });
      if (!orderExits) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }
      // create order note
      const orderNote = await this.orderNoteRepository.save({
        ...createOrderNoteDto,
        userId: user.id,
      });

      if (!orderNote) {
        throw new HttpException(
          'Somethings went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // get order note
      const orderNoteData = await this.orderNoteRepository
        .createQueryBuilder('order_note')
        // .select(this.select)
        .select([
          'order_note.id',
          'order_note.message',
          'order_note.created_at',
          'user.id as user_id',
          'user.email',
          'user.phone',
          'order.id as order_id',
        ])
        .leftJoin('order_note.user', 'user')
        .leftJoin('order_note.order', 'order')
        .where('order_note.id = :id', { id: orderNote.id })
        .getOne();

      return orderNoteData;
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Somethings went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // get all order notes
  async getAllOrderNotes(
    user,
    perPage: number = 10,
    currentPage: number = 0,
    orderId?: number,
    userId?: number,
    search?: string,
  ) {
    try {
      let whereRaw = 'order_note.deleted_at IS NULL';
      if (orderId) {
        whereRaw += ` AND order_note.order_id = ${orderId}`;
      }
      if (userId) {
        whereRaw += ` AND order_note.user_id = ${userId}`;
      }
      if (search) {
        whereRaw += ` AND (order_note.message LIKE '%${search}%' OR user.first_name LIKE '%${search}%' OR user.email LIKE '%${search}%' OR user.phone LIKE '%${search}%' OR order.order_number LIKE '%${search}%')`;
      }
      // get all order notes
      const [orderNotes, total] = await this.orderNoteRepository
        .createQueryBuilder('order_note')
        .select(this.select)
        .leftJoin('order_note.user', 'user')
        .leftJoin('order_note.order', 'order')
        .where(whereRaw)
        .orderBy('order_note.id', 'DESC')
        .take(perPage)
        .skip(currentPage * perPage)
        .getManyAndCount();

      return {
        data: orderNotes,
        perPage: perPage,
        currentPage: currentPage + 1,
        totalPage: Math.ceil(total / perPage),
        totalResult: total,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // get order note by id
  async getOrderNoteById() {
    try {
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Somethings went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // get order note by order id
  async getOrderNoteByOrderId(
    user,
    orderId: number,
    perPage: number = 10,
    currentPage: number = 0,
    search?: string,
  ) {
    try {
      let whereRaw = 'order_note.deleted_at IS NULL';
      if (orderId) {
        whereRaw += ` AND order_note.order_id = ${orderId}`;
      }
      if (search) {
        whereRaw += ` AND (order_note.message LIKE '%${search}%' OR user.first_name LIKE '%${search}%' OR user.email LIKE '%${search}%' OR user.phone LIKE '%${search}%' OR order.order_number LIKE '%${search}%')`;
      }
      // get all order notes
      const [orderNotes, total] = await this.orderNoteRepository
        .createQueryBuilder('order_note')
        .select(this.select)
        .leftJoin('order_note.user', 'user')
        .leftJoin('order_note.order', 'order')
        .where(whereRaw)
        .orderBy('order_note.id', 'DESC')
        .take(perPage)
        .skip(currentPage * perPage)
        .getManyAndCount();

      return {
        data: orderNotes,
        perPage: perPage,
        currentPage: currentPage + 1,
        totalPage: Math.ceil(total / perPage),
        totalResult: total,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // update order note
  async updateOrderNote() {
    try {
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Somethings went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // delete order note
  async deleteOrderNote() {
    try {
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Somethings went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
