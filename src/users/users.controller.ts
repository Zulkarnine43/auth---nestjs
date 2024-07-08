import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Req, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAdminDto, CreateCustomerDto } from './dto/create-user.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserTypeGuard } from 'src/common/guards/user-type.guard';
import { UserTypes } from 'src/common/decorators/user-type.decorator';
import { UserType } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('validate-token')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Req() req) {
    const user = req.user;
    return user;
  }

  @Post('admin')
  async create(@Req() req, @Body() createAdminDto: CreateAdminDto) {
    return await this.usersService.create(createAdminDto);
  }

  @Post('admin/login')
  adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.usersService.adminLogin(adminLoginDto);
  }


  @Get('admin/list')
  @Version('1')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async findAll(@Req() req, @Query() query) {
    return await this.usersService.findAll(
      query.perPage && parseInt(query.perPage),
      query.currentPage && query.currentPage - 1,
      query.search && query.search,
      query.status && query.status,
    );
  }

  @Post('customer')
  async createCustomer(@Req() req, @Body() createCustomerDto: CreateCustomerDto) {
    return await this.usersService.createCustomer(createCustomerDto);
  }

  @Post('customer/login')
  customerLogin(@Body() customerLoginDto: CustomerLoginDto) {
    return this.usersService.customerLogin(customerLoginDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
