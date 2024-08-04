import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { UserTypes } from 'src/common/decorators/user-type.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserTypeGuard } from 'src/common/guards/user-type.guard';
import { CreateEmiOrderDto } from '../dto/create-emi-order';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ShippingAddressUpdateDto } from '../dto/shipping-address-update.dto';
import { TrackMyOrderDto } from '../dto/track-my-order.dto';
import { UpdateOrderProductDto, UpdateOrderProductQtyDto } from '../dto/update-order-product.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { OrderService } from '../services/order.service';
import { AddOrderProductDto } from '../dto/add-order-product.dto';
import { UpdateDeliveryChargeDto, UpdateDeliveryChargesDto } from '../dto/update-delivery-charge.dto';
import { UserType } from 'src/users/entities/user.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  // update stock from warehouse and sku of order quantity
  @Patch('/:orderId/stock')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateStock(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body(new ParseArrayPipe({ items: UpdateStockDto }))
    updateStockDto: UpdateStockDto[],
  ) {
    try {
      // await this.orderService.updateStock(orderId, updateStockDto);

      return {
        message: 'Successfully updated',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // update stock from warehouse and sku of order quantity
  @Get('/:orderId/available-warehouse')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async getAvailableWarehouse(@Param('orderId', ParseIntPipe) orderId: number) {
    try {
      // return await this.orderService.getAvailableWarehouse(orderId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/myorder/track')
  @Version('1')
  async trackMyOrder(@Body() trackMyOrderDto: TrackMyOrderDto) {
    // return await this.orderService.trackMyOrder(trackMyOrderDto);
  }

  @Patch('/myorder/cancel/:orderNumber')
  @Version('1')
  @UserTypes(UserType.CUSTOMER)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async cancelMyOrder(@Req() req, @Param('orderNumber') orderNumber: string) {
    // return await this.orderService.cancelMyOrder(req.user, orderNumber);
  }

  // update order product status
  @Patch('/update-product-status/:orderProductId')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateOrderProductDetails(
    @Req() req,
    @Param('orderProductId') orderProductId: string,
    @Body() updateOrderProductDto: UpdateOrderProductDto,
  ) {
    // return await this.orderService.updateOrderProductDetails(
    //   req.user,
    //   +orderProductId,
    //   updateOrderProductDto,
    // );
  }

  @Get('/myorder')
  @Version('1')
  @UserTypes(UserType.CUSTOMER)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async findMyOrders(@Req() req, @Query() query) {
    // return await this.orderService.findMyOrders(
    //   req.user,
    //   query.currentPage ? +query.currentPage - 1 : 0,
    //   query.perPage ? +query.perPage : 10,
    //   query.search && query.search,
    //   query.status && query.status,
    // );
  }

  @Get('/myorder/:orderNumber')
  @Version('1')
  // @UserTypes(UserType.CUSTOMER)
  // @UseGuards(JwtAuthGuard, UserTypeGuard)
  async findMyOrderByNumber(
    @Req() req,
    @Param('orderNumber') orderNumber: string,
  ) {
    // return await this.orderService.findMyOrderByNumber(orderNumber);
  }

  @Patch('/:orderNumber/change-status')
  @Version('1')
  async updateMainOrderFromOtside(
    @Req() req,
    @Param('orderNumber') orderNumber: string,
    @Body() updateOrderStatus: UpdateOrderStatusDto,
  ) {
    // return await this.orderService.updateMainOrderStatusByThirdparty(
    //   orderNumber,
    //   updateOrderStatus,
    // );
  }

  @Patch('/main/change-status/:id')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateMainOrderStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() updateOrderStatus: UpdateOrderStatusDto,
  ) {
    // return await this.orderService.updateMainOrderStatus(
    //   req.user,
    //   +id,
    //   updateOrderStatus,
    // );
  }

  // update order payment status
  @Patch('/update-payment-status/:orderId')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateOrderPaymentStatus(
    @Req() req,
    @Param('orderId') id: string,
    @Body() updatePaymentStatus: UpdatePaymentStatusDto,
  ) {
    // return await this.orderService.updateOrderPaymentStatus(
    //   req.user,
    //   +id,
    //   updatePaymentStatus,
    // );
  }

  @Patch('change-status/:id')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() updateOrderStatus: UpdateOrderStatusDto,
  ) {
    // return await this.orderService.updateStatus(
    //   req.user,
    //   +id,
    //   updateOrderStatus,
    // );
  }

  @Patch('shipping-address-update/:id')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateShippingAddress(
    @Req() req,
    @Param('id') id: string,
    @Body() shippingAddressUpdateDto: ShippingAddressUpdateDto,
  ) {
    // return await this.orderService.updateShippingAddress(
    //   req.user,
    //   +id,
    //   shippingAddressUpdateDto,
    // );
  }

  @Post()
  @Version('1')
  @UserTypes(UserType.CUSTOMER)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    // return await this.orderService.create(req.user, createOrderDto);
  }

  // create emi order
  @Post('emi')
  @Version('1')
  @UserTypes(UserType.CUSTOMER)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async createEmi(@Req() req, @Body() createOrderDto: CreateEmiOrderDto) {
    // return await this.orderService.createEmi(req.user, createOrderDto);
  }

  @Post('/admin-order')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async createOrderByAdmin(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    // return await this.orderService.createOrderByAdmin(createOrderDto, req.user);
  }

  // @Get()
  // @Version('1')
  // @UserTypes(UserType.ADMIN)
  // @UseGuards(JwtAuthGuard, UserTypeGuard)
  // async findAll(@Req() req, @Query() query) {
  //   return await this.orderService.findAll(
  //     req.user,
  //     query.currentPage ? +query.currentPage - 1 : 0,
  //     query.perPage ? +query.perPage : 10,
  //     query.userId && +query.userId,
  //     query.search && query.search,
  //     query.status && query.status,
  //     query.startDate && query.startDate,
  //     query.endDate && query.endDate,
  //   );
  // }

  @Get()
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async findAll(@Req() req, @Query() query) {
    // return await this.orderService.findAll(
    //   req.user,
    //   query.currentPage ? +query.currentPage - 1 : 0,
    //   query.perPage ? +query.perPage : 10,
    //   query.userId && +query.userId,
    //   query.search && query.search,
    //   query.status && query.status,
    //   query.startDate && query.startDate,
    //   query.endDate && query.endDate,
    // );
  }

  // orders logs
  @Get('/logs')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async findLog(@Req() req, @Query() query) {
    // return await this.orderService.findLog(
    //   req.user,
    //   query.perPage ? +query.perPage : 10,
    //   query.currentPage ? +query.currentPage - 1 : 0,
    //   query.orderId && query.orderId,
    //   query.userId && query.userId,
    //   query.status && query.status,
    // );
  }

  @Get(':id')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async findOne(@Req() req, @Param('id') id: string) {
    // return await this.orderService.findOne(req.user, +id);
  }

  // update order product
  @Patch('/update-product/:orderProductId')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateOrderProduct(
    @Req() req,
    @Body() UpdateOrderProductQtyDto: UpdateOrderProductQtyDto,
    @Param('orderProductId') orderProductId: string,
  ) {
    // return await this.orderService.updateOrderProduct(
    //   req.user,
    //   +orderProductId,
    //   UpdateOrderProductQtyDto,
    // );
  }

  // add order product
  @Post('/add-product/:orderId')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async addOrderProduct(
    @Req() req,
    @Body(new ParseArrayPipe({ items: AddOrderProductDto, whitelist: true }))
    orderProducts: AddOrderProductDto[],
    @Param('orderId') orderId: string,
  ) {
    // return await this.orderService.addOrderProduct(
    //   req.user,
    //   +orderId,
    //   orderProducts,
    // );
  }

  // delete order product
  @Delete('/delete-product/:orderProductId')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async deleteOrderProduct(
    @Req() req,
    @Param('orderProductId') orderProductId: string,
  ) {
    // return await this.orderService.deleteOrderProduct(
    //   req.user,
    //   +orderProductId,
    // );
  }

  // update delivery charge
  @Patch('/update-delivery-change/:orderId')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateDeliveryChange(
    @Req() req,
    @Param('orderId') orderId: string,
    @Body() updateDeliveryChargeDto: UpdateDeliveryChargesDto,
  ) {
    // return await this.orderService.updateDeliveryCharge(
    //   req.user,
    //   +orderId,
    //   updateDeliveryChargeDto,
    // );
  }
}
