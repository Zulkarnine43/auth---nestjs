import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CreateDeliveryChargeDto } from '../dto/create-delivery-charge.dto';
import { UpdateDeliveryChargeDto } from '../dto/update-delivery-charge.dto';
import { DeliveryChargeService } from '../services/delivery-charge.service';
import { UserType } from 'src/users/entities/user.entity';

@Controller('delivery-charge')
export class DeliveryChargeController {
  constructor(private readonly deliveryChargeService: DeliveryChargeService) {}

  @Post('order-delivery-charge')
  @Version('1')
  // @UserTypes(UserType.CUSTOMER)
  // @UseGuards(JwtAuthGuard, UserTypeGuard)
  async getOrderDeliveryCharge(@Req() req, @Body() data) {
    return await this.deliveryChargeService.getOrderDeliveryCharge(
      req.user,
      data,
    );
  }

  @Get('base-charge')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async getBaseCharges(@Req() req) {
    return await this.deliveryChargeService.getBaseCharges(req.user);
  }

  // get delivery charge with shop key
  @Get('shop-delivery-charge')
  @Version('1')
  async getShopDeliveryCharge(@Req() req) {
    return await this.deliveryChargeService.getShopDeliveryCharge();
  }

  @Post()
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async create(
    @Req() req,
    @Body() createDeliveryChargeDto: CreateDeliveryChargeDto,
  ) {
    return await this.deliveryChargeService.create(
      req.user,
      createDeliveryChargeDto,
    );
  }

  @Get()
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async findAll(@Req() req, @Query() query) {
    return await this.deliveryChargeService.findAll(
      req.user,
      query.perPage ? +query.perPage : 10,
      query.currentPage ? +query.currentPage - 1 : 0,
    );
  }

  @Get(':id')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async findOne(@Req() req, @Param('id') id: string) {
    return await this.deliveryChargeService.findOne(req.user, +id);
  }

  @Patch(':id')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateDeliveryChargeDto: UpdateDeliveryChargeDto,
  ) {
    return await this.deliveryChargeService.update(
      req.user,
      +id,
      updateDeliveryChargeDto,
    );
  }

  @Delete(':id')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async remove(@Req() req, @Param('id') id: string) {
    return await this.deliveryChargeService.remove(req.user, +id);
  }
}
