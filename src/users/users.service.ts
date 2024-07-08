import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Not, Repository } from "typeorm";
import { CreateAdminDto, CreateCustomerDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from "bcrypt";
import { User, UserType } from "./entities/user.entity";
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectConnection() private readonly knex: Knex,
  ) { }

  async create(createAdminDto: CreateAdminDto) {
    createAdminDto.password = await bcrypt.hash(createAdminDto.password, 10);

    let newUser;
    try {
      newUser = await this.userRepository.save({
        ...createAdminDto,
        type: UserType.ADMIN,
      });
    } catch (e) {
      const errorMessage = {
        statusCode: 400,
        success: false,
        message: "Unable to create user",
        error: {},
      };
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const { password, ...result } = newUser;

    return result;
  }

  async adminLogin(loginAdminDto: AdminLoginDto) {
    let user;

    user = await this.findOneByEmail(loginAdminDto.email);

    if (!user) {
      const errorMessage = {
        statusCode: 400,
        success: false,
        message: 'User Not Found',
        error: {},
      };
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    // compare passwords
    const areEqual: boolean = await bcrypt.compare(loginAdminDto.password, user.password);

    if (!areEqual) {
      const errorMessage = {
        statusCode: 400,
        success: false,
        message: 'Invalid credentials',
        error: {},
      };
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    return await this.login(user);
  }

  async findOneByEmail(email) {
    // Get user by email
    let user;
    try {
      user = await this.userRepository.findOneBy({
        email: email,
        type: UserType.ADMIN,
      });
    } catch (e) {
      const errorMessage = {
        statusCode: 400,
        success: false,
        message: "Unable to find user",
        error: {},
      };
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // check user is exist or not
    if (!user) {
      const errorMessage = {
        statusCode: 400,
        success: false,
        message: "User not found",
        error: {},
      };
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async login(user: any) {
    const payload = {
      type: user.type,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    };
    return {
      user: {
        id: user.id,
        type: user.type,
        adminType: user.adminType,
        avatar: user.avatar,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        status: user.status,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    createCustomerDto.password = await bcrypt.hash(createCustomerDto.password, 10);

    let newUser;
    try {
      newUser = await this.knex.table('user').insert({
        ...createCustomerDto,
        type: UserType.CUSTOMER,
      });
      if (newUser) {
        const id = newUser[0];
        newUser = await this.knex('user').where('id', id).first(); // Resolves to any
      }
    } catch (e) {
      console.error('Error creating user:', e);
      const errorMessage = {
        statusCode: 400,
        success: false,
        message: "Unable to create user",
        error: {},
      };
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const { password, ...result } = newUser;

    return result;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
