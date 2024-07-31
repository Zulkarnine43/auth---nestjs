import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Order } from '../order/entities/order.entity';
// import { Product } from '../product/entities/product.entity';
import { GenerateCsvController } from './controllers/generate-csv.controller';
import { GenerateCsvService } from './services/generate-csv.service';
import { User } from 'src/users/entities/user.entity';
import { AwsS3Service } from 'src/awss3.service';

@Module({
  // imports: [TypeOrmModule.forFeature([Order, Product, User])],
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [GenerateCsvController],
  providers: [GenerateCsvService, AwsS3Service],
})
export class GenerateCsvModule {}
