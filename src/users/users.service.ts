import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Not, Repository } from "typeorm";
import { CreateAdminDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from "bcrypt";
import { User, UserType } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
