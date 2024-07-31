// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateAdminDto) {}
