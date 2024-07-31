import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { Response } from 'express';
import { GenerateCsvService } from '../services/generate-csv.service';

@Controller('generate-csv')
export class GenerateCsvController {
  constructor(private readonly generateCsvService: GenerateCsvService) {}

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
