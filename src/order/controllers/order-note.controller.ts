import {
  Body,
  Controller,
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
import { CreateOrderNoteDto } from '../dto/create-order-note.dto';
import { OrderNoteService } from '../services/order-note.service';
import { UserType } from 'src/users/entities/user.entity';

@Controller('order-note')
export class OrderNoteController {
  constructor(private readonly orderNoteService: OrderNoteService) {}

  // post order note
  @Post('')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async createOrderNote(
    @Req() req,
    @Body() createOrderNoteDto: CreateOrderNoteDto,
  ) {
    return await this.orderNoteService.createOrderNote(
      req.user,
      createOrderNoteDto,
    );
  }

  // get all order notes
  @Get('')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async getAllOrderNotes(@Req() req, @Query() query) {
    return await this.orderNoteService.getAllOrderNotes(
      req.user,
      query.perPage ? +query.perPage : 10,
      query.currentPage ? +query.currentPage - 1 : 0,
      query.orderId && query.orderId,
      query.userId && query.userId,
      query.search && query.search,
    );
  }

  // get all order notes
  @Get(':orderId')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async getAllOrderNotesByOrderID(
    @Req() req,
    @Query() query,
    @Param('orderId') orderId: string,
  ) {
    return await this.orderNoteService.getOrderNoteByOrderId(
      req.user,
      orderId ? +orderId : 0,
      query.perPage ? +query.perPage : 10,
      query.currentPage ? +query.currentPage - 1 : 0,
      query.search && query.search,
    );
  }

  //update order note
  @Patch('')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateOrderNote(
    @Req() req,
    @Body() createOrderNoteDto: CreateOrderNoteDto,
  ) {
    return await this.orderNoteService.createOrderNote(
      req.user,
      createOrderNoteDto,
    );
  }
}
