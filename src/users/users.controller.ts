import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAdminDto, CreateCustomerDto } from './dto/create-user.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('admin')
  async create(@Req() req, @Body() createAdminDto: CreateAdminDto) {
    return await this.usersService.create(createAdminDto);
  }

  @Post('admin/login')
  @Version('1')
  adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.usersService.adminLogin(adminLoginDto);
  }

  @Post('customer')
  async createCustomer(@Req() req, @Body() createCustomerDto: CreateCustomerDto) {
    return await this.usersService.createCustomer(createCustomerDto);
  }

  @Post('customer/login')
  @Version('1')
  customerLogin(@Body() customerLoginDto: CustomerLoginDto) {
    return this.usersService.customerLogin(customerLoginDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
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
