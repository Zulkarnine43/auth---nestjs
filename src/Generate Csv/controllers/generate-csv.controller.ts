import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Headers,
  Req,
  Res,
  UseGuards,
  Version,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { GenerateCsvService } from '../services/generate-csv.service';

@Controller('generate-csv')
export class GenerateCsvController {
  constructor(private readonly generateCsvService: GenerateCsvService) { }

  @Get('order')
  @Version('1')
  async getOrderData(@Req() req, @Query() query, @Res() res: Response) {
    return await this.generateCsvService.getOrderData(
      res,
      req.user,
      query.userId && +query.userId,
      query.search && query.search,
      query.status && query.status,
      query.startDate && query.startDate,
      query.endDate && query.endDate,
    );
  }

  @Get('order-list-export')
  @Version('1')
  async exportData(@Query() query, @Headers() headers) {
    return await this.generateCsvService.exportData(
      query.s,
      query.status,
      query.voucher_code,
      query.coupon_code,
      query.campaign_id,
      query.shop_id,
      query.payment_type,
      query.payment_status,
      query.sort_by,
      query.startDate,
      query.endDate,
      query.note,
      headers.user,
    );
  }

  // get product data
  @Get('product')
  @Version('1')
  async getAllProducts(@Req() req, @Query() query, @Res() res: Response) {
    return await this.generateCsvService.getAllProducts(
      res,
      req.user,
      query.search && query.search,
      query.status && query.status,
      query.category && query.category,
      query.brands && query.brands,
    );
  }

  // get customer data
  @Get('customer')
  @Version('1')
  async getAllCustomers(@Req() req, @Query() query, @Res() res: Response) {
    return await this.generateCsvService.getAllCustomers(
      res,
      req.user,
      query.search && query.search,
      query.status && query.status,
    );
  }
}
