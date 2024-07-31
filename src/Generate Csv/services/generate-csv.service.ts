import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJs from 'exceljs';
import { Response } from 'express';
// import { Order } from 'src/modules/order/entities/order.entity';
import { DataSource, Repository } from 'typeorm';
// import { throwError } from '../../../common/errors/errors.function';
// import { Product } from '../../product/entities/product.entity';
import { Customer, Products } from '../types/products.types';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GenerateCsvService {
  constructor(
    private dataSource: DataSource,
    // @InjectRepository(Order)
    // private orderRepository: Repository<Order>,
    // @InjectRepository(Product)
    // private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getOrderData(
    res: Response,
    user,
    userId = null,
    search = null,
    status = null,
    startDate = null,
    endDate = null,
  ) {
    const start = new Date(startDate);
    // console.log('start', start);
    // start.setHours(start.getHours() - 6);
    const end = new Date(endDate);
    // console.log('end', end);

    const modifiedStartDate = `${start.getFullYear()}-${
      start.getMonth() + 1
    }-${start.getDate()}`;

    const modifiedEndDate = `${end.getFullYear()}-${
      end.getMonth() + 1
    }-${end.getDate()}`;

    // console.log(modifiedStartDate, modifiedEndDate);

    let whereCondition = `order.deletedAt IS NULL`;

    if (userId) {
      whereCondition += ` AND order.userId = ${userId}`;
    }

    if (status) {
      whereCondition += ` AND order.status = '${status}'`;
    }

    if (startDate && endDate) {
      whereCondition += ` AND Date(order.createdAt) BETWEEN '${modifiedStartDate}' AND '${modifiedEndDate}'`;
    } else if (!startDate && endDate) {
      whereCondition += ` AND Date(order.createdAt) <= '${modifiedEndDate}'`;
    } else if (startDate && !endDate) {
      whereCondition += ` AND Date(order.createdAt) >= '${modifiedStartDate}'`;
    }

    if (search) {
      whereCondition += ` AND (order.id LIKE '%${search}%' OR order.orderNumber LIKE '%${search}%' OR order.shippingPhone LIKE '%${search}%' OR payments.transaction_id LIKE '%${search}%')`;
    }

    try {
      const orders = [];
      // const orders = await this.orderRepository
      //   .createQueryBuilder('order')
      //   .leftJoin('order.user', 'user')
      //   .where(whereCondition)
      //   .orderBy('order.id', 'DESC')
      //   .select([
      //     'order.id',
      //     'order.orderNumber',
      //     'order.discount',
      //     'order.subtotal',
      //     'order.deliveryCharge',
      //     'order.grandTotal',
      //     'order.paid',
      //     'order.due',
      //     'order.paymentMethod',
      //     'order.paymentStatus',
      //     'order.status',
      //     'order.createdAt',
      //     'order.updatedAt',
      //     'user.firstName',
      //     'user.lastName',
      //     'user.email',
      //     'user.phone',
      //   ])
      //   .getMany();

      return await this.generateOrderExcel(res, orders);
    } catch (e) {
      // throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
    }
  }

  async generateOrderExcel(res, orders: any[]) {
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 20 },
      { header: 'Order Number', key: 'orderNumber', width: 25 },
      { header: 'Sub Total', key: 'subtotal', width: 20 },
      { header: 'Delivery Charge', key: 'deliveryCharge', width: 20 },
      { header: 'Grand Total', key: 'grandTotal', width: 20 },
      { header: 'Payment Method', key: 'paymentMethod', width: 20 },
      { header: 'Emi', key: 'emi', width: 15 },
      { header: 'Purchase Date', key: 'purchaseDate', width: 15 },
      { header: 'Order Status', key: 'status', width: 15 },
      { header: 'Customer Name', key: 'userName', width: 25 },
      { header: 'Customer Email', key: 'userEmail', width: 15 },
      { header: 'Customer Phone', key: 'userPhone', width: 15 },
    ];
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    const data = orders?.map((order) => {
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        deliveryCharge: order?.deliveryCharge,
        grandTotal: order?.grandTotal,
        paymentMethod: order?.paymentMethod,
        emi: order?.emi,
        purchaseDate: order?.createdAt,
        status: order.status,
        userName: order.user?.firstName + ' ' + order.user?.lastName,
        userEmail: order.user?.email,
        userPhone: order.user?.phone,
      };
    });

    worksheet.addRows(data);
    // const fileName = `flight_bookings_${Date.now()}.xlsx`;

    // Set the response headers for Excel file
    // res.setHeader(
    //   'Content-Type',
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // );
    // res.setHeader(
    //   'Content-Disposition',
    //   'attachment; filename=generated-file.xlsx',
    // );

    // Pipe the Excel file directly to the response stream
    await workbook.csv.write(res);
    // await workbook.xlsx.write(res);

    res.end();
  }

  async getAllProducts(
    res: Response,
    user,
    search = null,
    status = null,
    category = null,
    brands = null,
  ) {
    let whereRawCondition = 'product.deleted_at IS NULL';

    // if status query exits
    if (status) {
      whereRawCondition += ` AND product.status = '${status}'`;
    }

    // if category query exits
    if (category) {
      whereRawCondition += ` AND product.category_id = ${category}`;
    }

    // if brand query exits
    if (brands) {
      whereRawCondition += ` AND product.brand_id = ${brands}`;
    }

    // if search query exits
    if (search) {
      whereRawCondition += ` 
      AND (product.name LIKE '%${search}%' 
      OR product.sku LIKE '%${search}%' 
      OR category.name LIKE '%${search}%' 
      OR (
        product.id IN (
          SELECT product_id
          FROM sku
          WHERE sku.sku LIKE '%${search}%' 
          OR sku.custom_sku LIKE '%${search}%' 
          OR sku.model_no LIKE '%${search}%'
        )
      ))`;
    }

    const products = [];
    // const products = await this.productRepository
    //   .createQueryBuilder('product')
    //   .leftJoin('product.category', 'category')
    //   .leftJoin('product.brand', 'brand')
    //   .innerJoin('product.skus', 'skus')
    //   .select([
    //     'product.id',
    //     'product.name',
    //     'product.sku',
    //     'product.status',
    //     'category.name',
    //     'brand.name',
    //   ])
    //   .where(whereRawCondition)
    //   .orderBy('product.id', 'DESC')
    //   .getMany();

    return await this.generateProductExcel(res, products);
  }

  async generateProductExcel(res: Response, products: Products[]) {
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('products');

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 20 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Sku', key: 'sku', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Category Name', key: 'categoryName', width: 30 },
      { header: 'Brand Name', key: 'brandName', width: 30 },
    ];
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    const data = products?.map((product) => {
      return {
        id: product?.id,
        name: product?.name,
        sku: product?.sku,
        status: product?.status,
        categoryName: product?.category?.name,
        brandName: product?.brand?.name,
      };
    });

    worksheet.addRows(data);

    // Pipe the Excel file directly to the response stream
    await workbook.csv.write(res);

    res.end();
  }

  async getAllCustomers(res: Response, user, search = null, status = null) {
    let whereRawCondition = `customer.deleted_at IS NULL AND customer.type = 'customer'`;

    // if status query exits
    if (status) {
      whereRawCondition += ` AND customer.status = '${status}'`;
    }

    // if search query exits
    if (search) {
      whereRawCondition += ` 
      AND (customer.firstName LIKE '%${search}%' or customer.lastName LIKE '%${search}%' or customer.email LIKE '%${search}%' or customer.phone LIKE '%${search}%')`;
    }

    const customers = await this.userRepository
      .createQueryBuilder('customer')
      .select([
        'customer.id',
        'customer.firstName',
        'customer.lastName',
        'customer.email',
        'customer.phone',
        'customer.status',
      ])
      .where(whereRawCondition)
      .orderBy('customer.id', 'DESC')
      .getMany();

    return this.generateCustomerExcel(res, customers);
  }

  async generateCustomerExcel(res: Response, customers: Customer[]) {
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('customers');

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 20 },
      { header: 'First Name', key: 'firstName', width: 20 },
      { header: 'last Name', key: 'lastName', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 30 },
      { header: 'Status', key: 'status', width: 20 },
    ];
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    const data = customers?.map((customer) => {
      return {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
      };
    });

    worksheet.addRows(data);

    // Pipe the Excel file directly to the response stream
    await workbook.csv.write(res);

    res.end();
  }
}
