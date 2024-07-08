import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserSchema } from 'src/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.SECRETKEY,
        signOptions: { expiresIn: '3y' },
      }),
    } as JwtModuleAsyncOptions),
    MongooseModule.forFeature([{ name: 'USERS', schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService]
})
export class UsersModule { }
