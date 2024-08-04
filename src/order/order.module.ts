import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from 'src/auth/auth.module';
// import { UserModule } from '../user/user.module';
// import { Area } from '../address/entities/area.entity';
// import { City } from '../address/entities/city.entity';
// import { Country } from '../address/entities/country.entity';
// import { Thana } from '../address/entities/thana.entity';
// import { Brand } from '../brand/entities/brand.entity';
// import { CategoryModule } from '../category/category.module';
// import { Category } from '../category/entities/category.entity';
import { MailModule } from '../mail/mail.module';
// import { Notification } from '../notification/entities/notification.entity';
// import { Offer } from '../offer/entities/offer.entity';
// import { OfferModule } from '../offer/offer.module';
// import { Product } from '../product/entities/product.entity';
// import { SkuAttribute } from '../product/entities/sku-attribute.entity';
// import { Sku } from '../product/entities/sku.entity';
import { DeliveryChargeController } from './controllers/delivery-charge.controller';
import { OrderNoteController } from './controllers/order-note.controller';
import { OrderController } from './controllers/order.controller';
import { DeliveryCharge } from './entities/delivery-charge.entity';
import { OrderLog } from './entities/order-log.entity';
import { OrderNote } from './entities/order-note.entity';
import { OrderProductAttribute } from './entities/order-product-attribute.entity';
import { OrderProduct } from './entities/order-product.entity';
import { OrderTimeline } from './entities/order-timeline.entity';
import { Order } from './entities/order.entity';
import { DeliveryChargeService } from './services/delivery-charge.service';
import { OrderNoteService } from './services/order-note.service';
import { OrderService } from './services/order.service';
// import { WarehouseSkusStock } from '../warehouse/entities/warehouseSkuQty.entity';
// import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveryCharge,
      Order,
      OrderProduct,
      OrderProductAttribute,
      OrderTimeline,
      OrderLog,
      OrderNote,
      Notification,
    ]),
    MailModule,
  ],
  controllers: [OrderController, DeliveryChargeController, OrderNoteController],
  providers: [OrderService, DeliveryChargeService, OrderNoteService],
  exports: [OrderService],
})
export class OrderModule { }
