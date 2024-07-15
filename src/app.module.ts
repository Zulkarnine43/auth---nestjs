import { Module } from '@nestjs/common';
import { DatabaseType } from 'typeorm';
import { knexConfig } from 'knex-config';
import { KnexModule } from 'nest-knexjs';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import * as dotenv from 'dotenv';
import { ChatGateway } from './chat.gateway';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { BullModule } from '@nestjs/bull';
import { SearchModule } from './search/search.module';
import { Product, ProductSchema } from './schema/product.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql' as DatabaseType,
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT, 10),
        username: process.env.MYSQL_ROOT_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        autoLoadEntities: true, // Automatically load entities from the `entities` array (if set)
        synchronize: true, // Set to false in production to avoid auto-schema sync
      }),
    } as TypeOrmModuleAsyncOptions),
    KnexModule.forRoot(knexConfig),
    BullModule.forRoot({
      redis: {
        host: process.env.SERVER_HOST,
        port: Number(process.env.REDIS_PORT),
        // password: process.env.REDIS_PASSWORD,
      },
    }),
    MongooseModule.forRoot(`${process.env.MONGODB_URI}`),
    MongooseModule.forFeature([{ name: 'USERS', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'PRODUCTS', schema: ProductSchema }]),
    UsersModule,
    RabbitmqModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule { }
