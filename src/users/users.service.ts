import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Not, Repository } from "typeorm";
import { CreateAdminDto, CreateCustomerDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from "bcrypt";
import { User, UserType } from "./entities/user.entity";
import { Knex } from 'knex';
// import { InjectConnection } from 'nest-knexjs';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtService } from '@nestjs/jwt';
import { CustomerLoginDto } from './dto/customer-login.dto';
import * as fs from 'fs';
import * as path from 'path';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { UserDocument } from 'src/schema/user.schema';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectConnection() private readonly knex: Knex,
    @InjectConnection() private connection: Connection,
    @InjectModel('USERS') private readonly userModel: Model<UserDocument>,
    private readonly rabbitmqService: RabbitmqService,
    @InjectQueue('user') private readonly userQueue: Queue,
  ) { }

  async create(
    createAdminDto: CreateAdminDto,
    avatar: Express.Multer.File,
  ) {
    let imagePath = null;
    if (avatar) {
      const extArray = avatar.mimetype.split('/');
      const extension = extArray[extArray.length - 1];
      const fileName = `${Date.now()}-${createAdminDto.firstName}.${extension}`;

      const uploadPath = path.join(__dirname, '../../..', 'public', 'uploads', fileName);

      // Ensure the upload directory exists
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

      // Write the file to the upload directory
      fs.writeFileSync(uploadPath, avatar.buffer);

      imagePath = `public/uploads/${fileName}`;
    }
    createAdminDto.avatar = imagePath;

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

  async createMongoCustomer(createCustomerDto: CreateCustomerDto) {
    createCustomerDto.password = await bcrypt.hash(createCustomerDto.password, 10);

    let newUser;
    try {
      // one way
      // const newData = new this.userModel(createCustomerDto);
      // return (await newData.save())?.toJSON();

      // another way
      // return await this.userModel.insertMany(createCustomerDto);

      // another
      const newData = await this.connection.db
        .collection('users')
        .insertOne(createCustomerDto);

      const data = await this.connection.db
        .collection('users')
        .findOne({ _id: newData.insertedId });
      return data
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

  async customerLogin(loginCustomerDto: CustomerLoginDto) {
    try {
      // check email or phone number
      const isEmail = await this.isValidEmail(loginCustomerDto.phone);

      if (!isEmail) {
        const phoneNumber = await this.checkPhoneNumberValidation(loginCustomerDto.phone);
        if (!phoneNumber) {
          throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
        }

        // formate phone number
        const phoneNumberFormate = await this.formatePhoneNumber(phoneNumber);
        if (!phoneNumberFormate) {
          throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
        }
        loginCustomerDto.phone = phoneNumberFormate;
      }

      let user;
      user = await this.findOneByPhone(loginCustomerDto.phone);

      if (!user) {
        const errorMessage = {
          statusCode: 400,
          success: false,
          message: 'User Not Found',
          error: {},
        };
        throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
      }

      // let result;
      // try {
      //   result = await this.rabbitmqService.publish(
      //     'order',
      //     'order_created_routing_key',
      //     user,
      //   );
      // } catch (e) {
      //   console.log(e);
      // }

      // try {
      //   result = await this.rabbitmqService.request(
      //     'delivery_charge_address_book',
      //     'delivery_charge_calculation_routing_key',
      //     { ...user },
      //     5000,
      //   );
      // } catch (e) {
      //   console.log(e);
      // }

      // console.log('result', result);

      return await this.login(user);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async isValidEmail(email) {
    // Regular expression for validating an email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // validation bd phone number
  async checkPhoneNumberValidation(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\+88|88)?(01[3-9]\d{8})$/);
    if (match) {
      const intlCode = match[1] ? '88' : '';
      return [intlCode, match[2]].join('');
    }
    return null;
  };

  async formatePhoneNumber(phoneNumber) {
    // Remove any spaces or hyphens in the number
    phoneNumber = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');

    // Check if the number starts with '01' (common in local Bangladeshi numbers)
    if (phoneNumber.startsWith('01')) {
      return '88' + phoneNumber;
    }

    // Check if the number starts with '+88'
    if (phoneNumber.startsWith('+8801')) {
      // Remove the '+' sign and return as is
      return '88' + phoneNumber.slice(3);
    }

    // Check if the number starts with '8801'
    if (phoneNumber.startsWith('8801')) {
      return phoneNumber;
    }
  };

  async findOneByPhone(phone) {
    // Get user by phone
    let user;
    try {
      user = await this.userRepository
        .createQueryBuilder()
        .where('phone = :phone OR email = :email', {
          phone,
          email: phone,
        })
        .andWhere('type = :type', { type: UserType.CUSTOMER })
        .getOne();
    } catch (e) {
      console.log(e);
      const errorMessage = {
        statusCode: 400,
        success: false,
        message: 'Unable to find user',
        error: {},
      };
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return user;
  }

  async findByPayload(payload) {
    let user;
    if (payload.type === 'admin') {
      user = await this.findOneByEmail(payload.email);
    } else if (payload.type === 'customer') {
      let userName;
      if (payload?.phone !== null) {
        userName = payload?.phone;
      } else if (payload?.email !== null) {
        userName = payload?.email;
      }
      user = await this.findOneByPhone(userName);
      return user
    }

    if (user) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async findAll(perPage = 10, currentPage = 0, search = null, status = null) {
    let filter;
    let andFilter;

    if (status) {
      andFilter = { type: UserType.ADMIN, status: status };
    } else {
      andFilter = { type: UserType.ADMIN };
    }

    if (search) {
      filter = [
        {
          ...andFilter,
          firstName: Like("%" + search + "%"),
        },
        {
          ...andFilter,
          lastName: Like("%" + search + "%"),
        },
        {
          ...andFilter,
          email: Like("%" + search + "%"),
        },
        {
          ...andFilter,
          phone: Like("%" + search + "%"),
        },
      ];
    } else {
      filter = [
        {
          ...andFilter,
        },
      ];
    }

    const [user, total] = await this.userRepository.findAndCount({
      where: filter,
      select: [
        "id",
        "avatar",
        "firstName",
        "lastName",
        "type",
        "adminType",
        "email",
        "phone",
        "gender",
        "status",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
      order: { createdAt: "DESC" },
      take: perPage,
      skip: currentPage * perPage,
    });

    return {
      data: user,
      perPage: perPage,
      currentPage: currentPage + 1,
      totalPage: Math.ceil(total / perPage),
      totalResult: total,
    };
  }

  async findOne(id: number) {
    return id
    const data = {
      id: id
    }
    return await this.userQueue.add('user-get-by-id', data, { delay: 1000 });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
