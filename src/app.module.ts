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
    MongooseModule.forRoot(`${process.env.MONGODB_URI}`),
    MongooseModule.forFeature([{ name: 'USERS', schema: UserSchema }]),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
