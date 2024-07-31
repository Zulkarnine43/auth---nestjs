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
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { json2csv } from 'json-2-csv';
import { randomInt } from 'crypto';
import { AwsS3Service } from 'src/awss3.service';

@Injectable()
export class GenerateCsvService {
  constructor(
    private readonly AwsS3Service: AwsS3Service,
    private dataSource: DataSource,
    // @InjectRepository(Order)
    // private orderRepository: Repository<Order>,
    // @InjectRepository(Product)
    // private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectModel() private readonly knex: Knex,
  ) { }

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

    const modifiedStartDate = `${start.getFullYear()}-${start.getMonth() + 1
      }-${start.getDate()}`;

    const modifiedEndDate = `${end.getFullYear()}-${end.getMonth() + 1
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

  async exportData(
    search,
    status,
    voucher_code,
    coupon_code,
    campaign_id,
    shop_id,
    payment_type,
    payment_status,
    sort_by,
    start_date,
    end_date,
    note,
    user,
  ) {
    let ids;

    const condition = {};

    const previous = await this.knex('order_reports')
      .where('status', 'pending')
      .orderBy('id', 'desc');
    console.log(previous);
    if (previous.length > 0) {
      return {
        success: false,
        message: 'Previous report is pending',
      };
    } else {
      const report = await this.knex('order_reports').insert({
        report_type: 'report_generate',
        status: 'pending',
        created_at: new Date(),
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        note: note,
        user_id: user.id,
      });

      let sortBy = sort_by ? `orders.${sort_by}` : 'orders.id';

      const start = new Date(start_date);
      console.log('start ', start);
      start.setHours(start.getHours() - 6);
      console.log('modified start ', start);
      const end = new Date(end_date);
      // end.setHours(start.getHours());

      const startDate = `${start.getFullYear()}-${start.getMonth() + 1
        }-${start.getDate()} ${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}.${start.getMilliseconds()}`;
      const endDate = `${end.getFullYear()}-${end.getMonth() + 1
        }-${end.getDate()} ${end.getHours() + 18
        }:${end.getMinutes()}:${end.getSeconds()}.${end.getMilliseconds()}`;

      console.log(startDate, endDate);

      let whereRaw = 'true';
      if (start_date && end_date && status && status !== 'PENDING') {
        whereRaw = `orders_status_log.created_at >= '${startDate}' AND orders_status_log.created_at < '${endDate}' AND orders_status_log.status = '${status}'`;
      } else if (start_date && end_date && !status) {
        whereRaw = `orders.created_at >= '${startDate}' AND orders.created_at < '${endDate}'`;
      } else if (!start_date && end_date) {
        whereRaw = `orders.created_at < '${endDate}'`;
      } else if (start_date && !end_date) {
        whereRaw = `orders.created_at >= '${startDate}'`;
      }

      if (payment_type) {
        condition['orders.payment_type'] =
          payment_type === 'COD' ? 'COD' : payment_type.toLowerCase();
      }
      if (payment_status) {
        condition['orders.payment_status'] = payment_status;
      }
      if (voucher_code) {
        condition['orders.voucher_code'] = voucher_code;
      }
      if (coupon_code) {
        condition['orders.coupon_code'] = coupon_code;
      }
      if (campaign_id) {
        condition['order_shop_products.campaign_id'] = campaign_id;
      }
      if (shop_id) {
        condition['order_shops.shop_id'] = shop_id;
      }
      if (search) {
        if (!ids) {
          ids = await this.knex('orders')
            .leftJoin(
              'order_shop_products',
              'order_shop_products.order_id',
              '=',
              'orders.id',
            )
            .leftJoin(
              'orders_status_log',
              'orders_status_log.order_id',
              '=',
              'orders.id',
            )
            .leftJoin('order_shops', 'orders.id', '=', 'order_shops.order_id')
            .where(condition)
            .whereRaw(whereRaw)
            .where('orders.customer_phone', 'like', `%${search}%`)
            .orWhere('orders.order_id', 'like', `%${search}%`)
            .orWhere('orders.customer_name', 'like', `%${search}%`)
            .orWhere('orders.total_price', 'like', `%${search}%`)
            .orWhere('orders.mm_trx_id', 'like', `%${search}%`)
            .orWhere('orders.client_trx_id', 'like', `%${search}%`)
            .groupBy('orders.order_id')
            .pluck('orders.id')
            .orderBy(sortBy, 'desc');
        }
      } else {
        ids = await this.knex('orders')
          .leftJoin(
            'orders_status_log',
            'orders_status_log.order_id',
            '=',
            'orders.id',
          )
          .leftJoin(
            'order_shop_products',
            'order_shop_products.order_id',
            '=',
            'orders.id',
          )
          .leftJoin('order_shops', 'orders.id', '=', 'order_shops.order_id')
          .where(condition)
          .whereRaw(whereRaw)
          .groupBy('orders.id')
          .orderBy(sortBy, 'desc')
          .pluck('orders.id');
      }

      sortBy = sort_by ? `orders.${sort_by}` : 'order_shop_products.id';

      const data = await this.knex('order_shop_products')
        .leftJoin('orders', 'order_shop_products.order_id', '=', 'orders.id')
        .leftJoin(
          'order_shops',
          'order_shop_products.order_shop_id',
          '=',
          'order_shops.id',
        )
        .leftJoin(
          'order_shop_product_variations',
          'order_shop_products.id',
          '=',
          'order_shop_product_variations.order_id',
        )
        .leftJoin(
          'orders_status_log',
          'orders_status_log.order_id',
          '=',
          'orders.id',
        )
        .whereIn('order_shop_products.order_id', ids)
        .select(
          'orders.id as id',
          'order_shop_products.created_at as created_at',
          'orders.order_id as order_id',
          'order_shop_products.name as product',
          'order_shop_products.product_category_name as category',
          'order_shop_products.brand_name as brand',
          'order_shop_products.product_sku as mm_sku',
          this.knex.raw(
            `CONCAT('${process.env.PRODUCT_URL}','',order_shop_products.product_slug) as product_link`,
          ),
          'order_shops.shop_name as shop_name',
          'orders.campaign_name as campaign_name',
          'orders.customer_name as customer_name',
          'orders.customer_phone as customer_phone',
          'orders.customer_email as customer_email',
          'orders.customer_note as customer_note',
          'orders.shipping_phone as shipping_phone',
          'orders.shipping_street_address as shipping_address',

          // this.knex.raw(
          //   '((order_shop_products.quantity) * (order_shop_products.discounted_unit_price - order_shop_products.seller_unit_price)) as profit',
          // ),
          // this.knex.raw(
          //   '(((order_shop_products.quantity) * (order_shop_products.discounted_unit_price - order_shop_products.seller_unit_price)) * 5/100) as vat',
          // ),

          this.knex.raw(
            "CONCAT(orders.shipping_area,', ',orders.shipping_city) as delivery_area",
          ),
          'orders.billing_phone as billing_phone',
          'orders.payment_time as payment_date',
          this.knex.raw(
            "( SELECT created_at as cd FROM orders_status_log where orders_status_log.order_id = orders.id and orders_status_log.status = 'CONFIRMED BY MM' ORDER BY orders_status_log.id DESC LIMIT 1) as confirmation_date",
          ),
          this.knex.raw(
            "( SELECT created_at as cd FROM orders_status_log where orders_status_log.order_id = orders.id and orders_status_log.status = 'DELIVERED' ORDER BY orders_status_log.id DESC LIMIT 1) as delivered_date",
          ),
          'order_shop_products.status as product_status',
          'order_shop_products.quantity as quantity',
          'order_shop_products.seller_unit_price as purchase_price',
          this.knex.raw(
            '(order_shop_products.quantity * order_shop_products.discounted_unit_price) as sales_price',
          ),
          // 'order_shop_products.discounted_unit_price as sales_price',
          'order_shop_products.discounted_price as customer_purchase_price',
          'order_shop_products.delivery_charge as shipping_cost',
          'orders.delivery_charge as shipping_cost',
          this.knex.raw(
            '(order_shop_products.discounted_price - order_shop_products.seller_unit_price) as profit',
          ),
          this.knex.raw(
            '((order_shop_products.discounted_price - order_shop_products.seller_unit_price) * 5/100) as vat',
          ),
          'orders.payment_type as payment_type',
          'orders.payment_status as payment_status',
          'orders.mm_trx_id as mm_trx_id',
          'orders.client_trx_id as client_trx_id',
          this.knex.raw(
            '( SELECT GROUP_CONCAT(option_value) as tq FROM order_shop_product_variations where order_shop_products.id = order_shop_product_variations.order_shop_product_id) as selectd_veriants',
          ),
        )
        .groupBy('order_shop_products.id')
        .orderBy(sortBy, 'desc');
      // console.log(report);
      json2csv(data, (err, csv) => {
        if (err) {
          throw err;
        }
        // Print CSV string
        console.log(report);
        this.writeFile(csv, report[0]);
      });
    }
  }

  async writeFile(data, id) {
    console.log('id is ', id);
    const originalname =
      Date.parse(new Date().toString()) +
      randomInt(11111111, 99999999).toString() +
      '.csv';
    const file = await this.AwsS3Service.s3_upload(
      data,
      'order-report/' + originalname,
      'csv',
    );
    console.log(file);
    await this.knex('order_reports').where('id', id).update({
      path: file.Location,
      status: 'completed',
      completed_at: new Date(),
    });
  }
}
