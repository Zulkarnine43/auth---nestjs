import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateAdminDto) {}
