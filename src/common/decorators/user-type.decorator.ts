import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/users/entities/user.entity';

export const UserTypes = (...args: UserType[]) =>
  SetMetadata('userTypes', args);
