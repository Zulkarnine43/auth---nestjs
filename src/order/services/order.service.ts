import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { OrderStatuses } from 'src/common/constant/order-status.data';
import { throwError } from 'src/common/errors/errors.function';
import {
  checkDiscountValidation,
  checkPhoneNumberValidation,
  formatPhoneNumber,
  generateOrderNumber,
  tenureMonth,
} from 'src/common/helpers/helpers.function';
// import { Area } from 'src/modules/address/entities/area.entity';
// import { City } from 'src/modules/address/entities/city.entity';
// import { Country } from 'src/modules/address/entities/country.entity';
// import { Thana } from 'src/modules/address/entities/thana.entity';
// import { OfferService } from 'src/modules/offer/services/offer.service';
// import {
//   Product,
//   ProductStatus,
// } from 'src/modules/product/entities/product.entity';
// import { Sku } from 'src/modules/product/entities/sku.entity';
// import { User, UserType } from 'src/modules/user/entities/user.entity';
// import { WarehouseSkusStock } from 'src/modules/warehouse/entities/warehouseSkuQty.entity';
import { DataSource, In, LessThan, Like, Not, Repository } from 'typeorm';
// import { CategoryService } from '../../category/services/category.service';
// import { MailService } from '../../mail/services/mail.service';
// import { Notification } from '../../notification/entities/notification.entity';
// import { CustomerService } from '../../user/services/customer.service';
import { CreateEmiOrderDto } from '../dto/create-emi-order';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ShippingAddressUpdateDto } from '../dto/shipping-address-update.dto';
import { TrackMyOrderDto } from '../dto/track-my-order.dto';
import { UpdateOrderProductDto, UpdateOrderProductQtyDto } from '../dto/update-order-product.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';
import { UpdateStockDto } from '../dto/update-stock.dto';
import {
  DeliveryCharge,
  DeliveryChargeType,
} from '../entities/delivery-charge.entity';
import { OrderLog } from '../entities/order-log.entity';
import { OrderProductAttribute } from '../entities/order-product-attribute.entity';
import { OrderProduct } from '../entities/order-product.entity';
import { OrderTimeline } from '../entities/order-timeline.entity';
import { Order, PaymentStatus } from '../entities/order.entity';
import { OrderProductStatus } from '../enum/order-product.enum';
import { ORDER_PLACED_BY_TYPE } from '../enum/order-placed.enum';
import { AddOrderProductDto } from '../dto/add-order-product.dto';
import { UpdateDeliveryChargeDto, UpdateDeliveryChargesDto } from '../dto/update-delivery-charge.dto';

// order log status
export enum OrderLogStatus {
  ORDER_PLACED = 'Order Placed',
  ORDER_CONFIRMED = 'Order Confirmed',
  ORDER_PROCESSING = 'Order Processing',
  ORDER_SHIPPED = 'Order Shipped',
  ORDER_DELIVERED = 'Order Delivered',
  ORDER_CANCELED = 'Order Canceled',
  ORDER_RETURNED = 'Order Returned',
  ORDER_REFUNDED = 'Order Refunded',
}

@Injectable()
export class OrderService {
  constructor(
    // @InjectRepository(Product)
    // private productRepository: Repository<Product>,
    // @InjectRepository(Sku) private skuRepository: Repository<Sku>,
    // @InjectRepository(Order)
    // private orderRepository: Repository<Order>,
    // @InjectRepository(Notification)
    // private notificationRepository: Repository<Notification>,
    // @InjectRepository(OrderLog)
    // private orderLogRepository: Repository<OrderLog>,
    // @InjectRepository(OrderProduct)
    // private orderProductRepository: Repository<OrderProduct>,
    // @InjectRepository(WarehouseSkusStock)
    // private warehouseSkusStockRepository: Repository<WarehouseSkusStock>,
    // @InjectRepository(OrderProductAttribute)
    // private orderProductAttributeRepository: Repository<OrderProductAttribute>,
    // @InjectRepository(Country)
    // private countryRepository: Repository<Country>,
    // @InjectRepository(City)
    // private cityRepository: Repository<City>,
    // @InjectRepository(Thana)
    // private thanaRepository: Repository<Thana>,
    // @InjectRepository(Area)
    // private areaRepository: Repository<Area>,
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    // @InjectRepository(DeliveryCharge)
    // private deliveryChargeRepository: Repository<DeliveryCharge>,
    // @Inject(forwardRef(() => OfferService)) private offerService: OfferService,
    // private categoryService: CategoryService,

    // private dataSource: DataSource,
    // private customerService: CustomerService,
    // private readonly mailService: MailService,
  ) { }

  // async create(user, createOrderDto: CreateOrderDto) {
  //   // validate phone number
  //   const shippingPhone = checkPhoneNumberValidation(
  //     createOrderDto.shippingPhone,
  //   );
  //   const billingPhone = checkPhoneNumberValidation(
  //     createOrderDto.billingPhone,
  //   );
  //   if (!shippingPhone || !billingPhone) {
  //     throwError(400, [], 'Invalid phone number');
  //   }

  //   // Get and Check order skus
  //   if (createOrderDto.products.length === 0)
  //     throwError(400, [], 'Invalid products');
  //   let products;
  //   try {
  //     products = await this.skuRepository.find({
  //       where: {
  //         id: In(createOrderDto.products.map((product) => product.skuId)),
  //       },
  //       relations: [
  //         'product',
  //         'attributes',
  //         'product.category',
  //         'product.brand',
  //       ],
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  //   }

  //   if (products.length !== createOrderDto.products.length) {
  //     throwError(400, [], 'Invalid products');
  //   }

  //   let skus = [];
  //   let preOrderAmount;

  //   // return products;
  //   skus = products.map(async (sku) => {
  //     // Check quantity is valid
  //     // console.log('skus', sku);
  //     const quantity = createOrderDto.products.find(
  //       (item) => item.skuId == sku.id,
  //     ).quantity;

  //     if (quantity > sku.quantity) throwError(400, [], 'Invalid quantity');

  //     preOrderAmount = sku?.preOrderPer ? sku?.preOrderPer : null;

  //     // Check product is active or not
  //     if (sku.product.status !== ProductStatus.ACTIVE)
  //       throwError(400, [], 'Product is not active');

  //     const matchProduct = createOrderDto.products.find(
  //       (item) => item.skuId === sku.id,
  //     );

  //     // let customeSizePrice: number = 0;
  //     const customeSizePrice: { name: string; size: number; price: number }[] =
  //       [];
  //     // check if measure exits or not
  //     if (matchProduct.custom_sizes) {
  //       // // get category measurement
  //       const category = await this.categoryService.getCategoryMeasurements(
  //         sku.product.categoryId,
  //       );
  //       // loop through all custom sizes
  //       for (const customSizeWithKey of matchProduct?.custom_sizes) {
  //         // category measurement pricing parse
  //         const measurementPricing = JSON.parse(category.measurementPricing);
  //         // check if measurement exits or not
  //         const mainMeasurement = measurementPricing.find((measure) => {
  //           return measure?.name === customSizeWithKey?.key;
  //         });
  //         if (mainMeasurement) {
  //           const measurement = this.getCustomePrice(
  //             +customSizeWithKey.value,
  //             mainMeasurement?.values,
  //           );
  //           customeSizePrice.push({
  //             name: customSizeWithKey.key,
  //             size: Number(customSizeWithKey.value),
  //             price: Number(measurement),
  //           });
  //         } else {
  //           customeSizePrice.push({
  //             name: customSizeWithKey.key,
  //             size: Number(customSizeWithKey.value),
  //             price: 0,
  //           });
  //         }
  //       }
  //     }

  //     // custome size amount
  //     let customeSizePriceAmount = customeSizePrice.reduce(
  //       (total, size) => total + size.price,
  //       0,
  //     );

  //     // if discount valid then calculate total price with discount
  //     const calcTotalPrice = checkDiscountValidation(
  //       true,
  //       sku.discountedPrice,
  //       sku.discountedPriceStart,
  //       sku.discountedPriceEnd,
  //     )
  //       ? sku.discountedPrice * quantity +
  //       customeSizePriceAmount * quantity +
  //       ((sku.vat * sku.discountedPrice) / 100) * quantity
  //       : sku.price * quantity +
  //       customeSizePriceAmount * quantity +
  //       ((sku.vat * sku.price) / 100) * quantity;

  //     return {
  //       productId: sku.product.id,
  //       skuId: sku.id,
  //       sku: sku.sku,
  //       customSku: sku.customSku,
  //       name: sku.product.name,
  //       slug: sku.product.slug,
  //       purchasePrice: sku.purchasePrice,
  //       price: sku.price,
  //       discountedPrice: checkDiscountValidation(
  //         true,
  //         sku.discountedPrice,
  //         sku.discountedPriceStart,
  //         sku.discountedPriceEnd,
  //       )
  //         ? sku.discountedPrice
  //         : 0,
  //       quantity: quantity,
  //       vat: sku.vat,
  //       insideDhaka: sku.product.insideDhaka,
  //       outsideDhaka: sku.product.outsideDhaka,
  //       warrantyType: sku.product.warrantyType,
  //       warranty: sku.product.warranty,
  //       custom_sizes: JSON.stringify(customeSizePrice),
  //       customeSize: JSON.stringify(customeSizePrice),
  //       // measurementSize: matchProduct?.measurementSize,
  //       // add vat to total price
  //       // totalPrice:
  //       //   sku.discountedPrice * quantity +
  //       //   ((sku.vat * sku.discountedPrice) / 100) * quantity,
  //       totalPrice: calcTotalPrice,
  //       ...(sku.product.brand && { brand: sku.product.brand.name }),
  //       categoryId: sku.product?.category?.id,
  //       brandId: sku.product?.brand?.id,
  //       thumbnail: sku.product.thumbnail,
  //       attributes:
  //         sku?.attributes?.map((item) => ({
  //           key: item.key,
  //           value: item.value,
  //         })) || [],
  //       // attributes:
  //       //   matchProduct?.attributes?.map((item) => ({
  //       //     key: item.key,
  //       //     value: item.value,
  //       //   })) || [],
  //       discount: checkDiscountValidation(
  //         true,
  //         sku.discountedPrice,
  //         sku.discountedPriceStart,
  //         sku.discountedPriceEnd,
  //       ),
  //       status: 'Order Placed',
  //     };
  //   });

  //   skus = await Promise.all(skus);

  //   // Get Shipping Address
  //   let shippingCountry;
  //   let billingCountry;
  //   let shippingCity;
  //   let billingCity;
  //   let shippingThana;
  //   let billingThana;
  //   let shippingArea;
  //   let billingArea;
  //   try {
  //     if (createOrderDto?.shippingCountryId) {
  //       shippingCountry = await this.countryRepository.findOne({
  //         where: { id: createOrderDto.shippingCountryId },
  //       });
  //     }

  //     if (createOrderDto?.shippingCityId) {
  //       shippingCity = await this.cityRepository.findOne({
  //         where: { id: createOrderDto.shippingCityId },
  //       });
  //     }

  //     if (createOrderDto?.shippingThanaId) {
  //       shippingThana = await this.thanaRepository.findOne({
  //         where: { id: createOrderDto.shippingThanaId },
  //       });
  //     }

  //     if (createOrderDto?.shippingAreaId) {
  //       shippingArea = await this.areaRepository.findOne({
  //         where: { id: createOrderDto.shippingAreaId },
  //       });
  //     }

  //     if (createOrderDto?.billingCountryId) {
  //       billingCountry = await this.countryRepository.findOne({
  //         where: { id: createOrderDto.billingCountryId },
  //       });
  //     }
  //     if (createOrderDto?.billingCityId) {
  //       billingCity = await this.cityRepository.findOne({
  //         where: { id: createOrderDto.billingCityId },
  //       });
  //     }

  //     if (createOrderDto?.billingThanaId) {
  //       billingThana = await this.thanaRepository.findOne({
  //         where: { id: createOrderDto.billingThanaId },
  //       });
  //     }

  //     if (createOrderDto?.billingAreaId) {
  //       billingArea = await this.areaRepository.findOne({
  //         where: { id: createOrderDto.billingAreaId },
  //       });
  //     }
  //   } catch (e) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }

  //   // if (!shippingCountry) throwError(400, [], 'Invalid shipping country');
  //   // if (!billingCountry) throwError(400, [], 'Invalid billing country');
  //   // if (!shippingCity) throwError(400, [], 'Invalid shipping city');
  //   // if (!billingCity) throwError(400, [], 'Invalid billing city');
  //   // if (!shippingThana) throwError(400, [], 'Invalid shipping thana');
  //   // if (!billingThana) throwError(400, [], 'Invalid billing thana');
  //   // if (!shippingArea) throwError(400, [], 'Invalid shipping area');
  //   // if (!billingArea) throwError(400, [], 'Invalid billing area');

  //   //
  //   // Prepare shipping data
  //   const shipping = {
  //     shippingName: createOrderDto.shippingName,
  //     shippingPhone: createOrderDto.shippingPhone,
  //     ...(createOrderDto.shippingEmail && {
  //       shippingEmail: createOrderDto.shippingEmail,
  //     }),
  //     // shippingCountry: shippingCountry.name,
  //     // shippingCity: shippingCity.name,
  //     shippingStreet: createOrderDto.shippingStreet,
  //     shippingPostalCode: createOrderDto.shippingPostalCode,
  //     shippingLat: createOrderDto.shippingLat,
  //     shippingLon: createOrderDto.shippingLon,
  //   };

  //   if (shippingCountry) {
  //     shipping['shippingCountry'] = shippingCountry.name;
  //   }

  //   if (shippingCity) {
  //     shipping['shippingCity'] = shippingCity.name;
  //   }

  //   if (shippingThana) {
  //     shipping['shippingThana'] = shippingThana.name;
  //   }

  //   if (shippingArea) {
  //     shipping['shippingArea'] = shippingArea.name;
  //   }

  //   // Prepare billing data
  //   const billing = {
  //     billingName: createOrderDto.billingName,
  //     billingPhone: createOrderDto.billingPhone,
  //     ...(createOrderDto.billingEmail && {
  //       billingEmail: createOrderDto.billingEmail,
  //     }),
  //     // billingCountry: billingCountry.name,
  //     // billingCity: billingCity.name,
  //     billingStreet: createOrderDto.billingStreet,
  //     billingPostalCode: createOrderDto.billingPostalCode,
  //     billingLat: createOrderDto.billingLat,
  //     billingLon: createOrderDto.billingLon,
  //   };

  //   if (billingCountry) {
  //     billing['billingCountry'] = billingCountry.name;
  //   }

  //   if (billingCity) {
  //     billing['billingCity'] = billingCity.name;
  //   }

  //   if (billingThana) {
  //     billing['billingThana'] = billingThana.name;
  //   }

  //   if (billingArea) {
  //     billing['billingArea'] = billingArea.name;
  //   }

  //   const status = 'Pending';
  //   // createOrderDto?.paymentMethod === 'COD' ||
  //   // createOrderDto?.paymentMethod === 'cod_with_card'
  //   //   ? 'Pending'
  //   //   : 'Order Placed';

  //   const orderData = {
  //     orderNumber: generateOrderNumber(),
  //     userId: user.id,
  //     type: createOrderDto?.type ? createOrderDto?.type : null,
  //     shopId: createOrderDto?.shopId ? createOrderDto?.shopId : null,
  //     subtotal: 0,
  //     deliveryCharge: 0,
  //     grandTotal: 0,
  //     due: 0,
  //     paid: 0,
  //     discount: 0,
  //     offerId: null,
  //     paymentStatus: PaymentStatus.UNPAID,
  //     skus: skus,
  //     ...shipping,
  //     ...billing,
  //     note: createOrderDto.note,
  //     preOrderAmount: preOrderAmount,
  //     paymentMethod: createOrderDto?.paymentMethod,
  //     status: status,
  //   };

  //   const deliverCharge = await this.calculateDeliveryCharge(
  //     shippingCity.id,
  //     skus,
  //   );
  //   // return deliverCharge;

  //   // Calculate Summary
  //   orderData.subtotal = skus.reduce((a, b) => a + b.totalPrice, 0);
  //   orderData.deliveryCharge = deliverCharge;
  //   if (
  //     preOrderAmount &&
  //     createOrderDto?.type === 'pre-order' &&
  //     createOrderDto?.shopId !== null
  //   ) {
  //     orderData.deliveryCharge = 0;
  //   }
  //   orderData.grandTotal = orderData.subtotal;

  //   // check any free delivery found or not
  //   if (createOrderDto?.offerId === null || createOrderDto?.offerId === 0) {
  //     const freeDeliveryData = await this.offerService.checkFreeDelivery(
  //       orderData.grandTotal,
  //     );
  //     if (freeDeliveryData && freeDeliveryData.status === true) {
  //       orderData.deliveryCharge = 0;
  //     }
  //   }

  //   orderData.discount = 0;
  //   if (createOrderDto.offerId) {
  //     const offerData = await this.offerService.calculateOffer(
  //       user,
  //       orderData.deliveryCharge,
  //       orderData.grandTotal,
  //       createOrderDto.offerId,
  //     );

  //     if (offerData && offerData.status === true) {
  //       if (offerData?.type === 'discount') {
  //         orderData.discount = offerData.discountAmount
  //           ? offerData.discountAmount
  //           : 0;

  //         if (offerData?.offer?.isFreeDelivery) {
  //           orderData.deliveryCharge = 0;
  //         }
  //       } else if (offerData?.type === 'free_delivery') {
  //         orderData.deliveryCharge = 0;
  //       }

  //       orderData.grandTotal =
  //         orderData.grandTotal - orderData.discount + orderData.deliveryCharge;
  //       orderData.offerId = createOrderDto.offerId;
  //       orderData.due = orderData.grandTotal;
  //     } else {
  //       throwError(400, [], 'Invalid offer');
  //     }

  //     console.log(offerData);
  //   } else {
  //     orderData.grandTotal = orderData.grandTotal + orderData.deliveryCharge;
  //   }

  //   orderData.due = orderData.grandTotal;
  //   orderData.paid = 0;

  //   // Store data to database with transaction
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   let insertedOrder;
  //   try {
  //     const { skus, ...data } = { ...orderData };

  //     const newOrder = await queryRunner.manager
  //       .getRepository('order')
  //       .save(data);

  //     // if new order is created then remove from cart
  //     if (newOrder['orderNumber']) {
  //       for (const product of skus) {
  //         await queryRunner.manager
  //           .getRepository('cart')
  //           .delete({ skuId: product.skuId, userId: user.id });
  //       }
  //     }

  //     for (const product of skus) {
  //       const attributes = product.attributes;
  //       // const gng_gift = JSON.stringify(product.gng_gift);
  //       // const brand_gift = JSON.stringify(product.brand_gift);
  //       // const custom_sizes = JSON.stringify(product.custom_sizes);
  //       delete product.attributes;
  //       delete product.gng_gift;
  //       delete product.brand_gift;
  //       // console.log('product=====> ', product);

  //       // Parsing gng_gift and brand_gift
  //       // createOrderDto.gng_gift = createOrderDto.gng_gift ? JSON.parse(createOrderDto.gng_gift) : [];
  //       // createOrderDto.brand_gift = createOrderDto.brand_gift ? JSON.parse(createOrderDto.brand_gift) : [];

  //       const newProduct = await queryRunner.manager
  //         .getRepository('order_product')
  //         .save({
  //           orderId: newOrder.id,
  //           ...product,
  //           // gng_gift: gng_gift,
  //           // brand_gift: brand_gift,
  //           // custom_sizes: custom_sizes,
  //           status: 'Order Placed',
  //         });

  //       // Decrease product sku quantity
  //       // await queryRunner.manager
  //       //   .getRepository('sku')
  //       //   .update(
  //       //     { id: product.skuId },
  //       //     { stockQuantity: () => `stock_quantity - ${product.quantity}` },
  //       //   );

  //       // insert product attributes
  //       const attributeData = attributes.map((attribute) => {
  //         return {
  //           orderProductId: newProduct.id,
  //           key: attribute.key,
  //           value: attribute.value,
  //         };
  //       });

  //       if (attributeData.length > 0) {
  //         await queryRunner.manager
  //           .getRepository('order_product_attribute')
  //           .save(attributeData);
  //       }
  //     }

  //     // Insert into order timeline table
  //     await queryRunner.manager
  //       .getRepository('order_timeline')
  //       .save({ orderId: newOrder.id, status: newOrder.status });

  //     // Insert In system notification for customer
  //     await queryRunner.manager.getRepository('notification').save({
  //       userId: user.id,
  //       userType: UserType.CUSTOMER,
  //       content: `Your order #${newOrder?.orderNumber} has been placed successfully.`,
  //       type: 'order',
  //       param: newOrder?.orderNumber,
  //     });

  //     // Insert In system notification for admin
  //     await queryRunner.manager.getRepository('notification').save({
  //       userType: UserType.ADMIN,
  //       content: `You received a new Order #${newOrder.orderNumber}`,
  //       type: 'order',
  //       param: newOrder.id,
  //     });

  //     await queryRunner.commitTransaction();

  //     insertedOrder = await this.orderRepository.findOne({
  //       where: { id: newOrder.id },
  //       relations: [
  //         'products',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'timeline',
  //         'offer',
  //         'user',
  //       ],
  //       select: {
  //         user: {
  //           id: true,
  //           avatar: true,
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //           phone: true,
  //           status: true,
  //         },
  //       },
  //     });

  //     // save order log data
  //     await this.saveOrderLog(
  //       null,
  //       insertedOrder,
  //       OrderLogStatus.ORDER_PLACED,
  //       'order placed',
  //       null,
  //       insertedOrder,
  //     );

  //     // await queryRunner.release();

  //     // await queryRunner.manager.getRepository('order_log').save({
  //     //   userId: null,
  //     //   orderId: newOrder.id,
  //     //   type: OrderLogStatus.ORDER_PLACED,
  //     //   message: 'Order Placed',
  //     //   oldData: null,
  //     //   newData: JSON.stringify(insertedOrder),
  //     // });
  //   } catch (e) {
  //     console.log(e);
  //     await queryRunner.rollbackTransaction();
  //     await queryRunner.release();
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   } finally {
  //     await queryRunner.release();
  //   }

  //   return {
  //     orderNumber: insertedOrder.orderNumber,
  //     grandTotal: insertedOrder.grandTotal,
  //     orderData: insertedOrder,
  //   };
  // }

  // async createOrderByAdmin(createOrderDto: CreateOrderDto, admin: any) {
  //   // validate phone number
  //   const shippingPhone = checkPhoneNumberValidation(
  //     createOrderDto.shippingPhone,
  //   );
  //   const billingPhone = checkPhoneNumberValidation(
  //     createOrderDto.billingPhone,
  //   );
  //   if (!shippingPhone || !billingPhone) {
  //     throwError(400, [], 'Invalid phone number');
  //   }

  //   // formate phone number
  //   const shippingPhoneFormater = formatPhoneNumber(shippingPhone);
  //   const billingPhoneFormater = formatPhoneNumber(billingPhone);
  //   if (!shippingPhoneFormater || !billingPhoneFormater) {
  //     throwError(400, [], 'Invalid phone number');
  //   }
  //   //update phone number
  //   createOrderDto.shippingPhone = shippingPhoneFormater;
  //   createOrderDto.billingPhone = billingPhoneFormater;

  //   // create user
  //   let user;
  //   try {
  //     const userCreateData = {
  //       firstName: createOrderDto.shippingName,
  //       phone: createOrderDto.shippingPhone,
  //     };
  //     user = await this.customerService.createWithoutLogin(userCreateData);
  //   } catch (error) {
  //     throwError(400, [], error.message);
  //   }

  //   // Get and Check order skus
  //   if (createOrderDto.products.length === 0)
  //     throwError(400, [], 'Invalid products');
  //   let products;
  //   try {
  //     products = await this.skuRepository.find({
  //       where: {
  //         id: In(createOrderDto.products.map((product) => product.skuId)),
  //       },
  //       relations: [
  //         'product',
  //         'attributes',
  //         'product.category',
  //         'product.brand',
  //       ],
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  //   }

  //   if (products.length !== createOrderDto.products.length) {
  //     throwError(400, [], 'Invalid products');
  //   }

  //   let skus = [];
  //   let preOrderAmount;

  //   // return products;
  //   skus = products.map(async (sku) => {
  //     // Check quantity is valid
  //     // console.log('skus', sku);
  //     const quantity = createOrderDto.products.find(
  //       (item) => item.skuId == sku.id,
  //     ).quantity;

  //     if (quantity > sku.quantity) throwError(400, [], 'Invalid quantity');

  //     preOrderAmount = sku?.preOrderPer ? sku?.preOrderPer : null;

  //     // // Check product is active or not
  //     // if (sku.product.status !== ProductStatus.ACTIVE)
  //     //   throwError(400, [], 'Product is not active');

  //     const matchProduct = createOrderDto.products.find(
  //       (item) => item.skuId === sku.id,
  //     );

  //     // let customeSizePrice: number = 0;
  //     const customeSizePrice: { name: string; size: number; price: number }[] =
  //       [];
  //     // check if measure exits or not
  //     if (matchProduct.custom_sizes) {
  //       // // get category measurement
  //       const category = await this.categoryService.getCategoryMeasurements(
  //         sku.product.categoryId,
  //       );
  //       // loop through all custom sizes
  //       for (const customSizeWithKey of matchProduct?.custom_sizes) {
  //         // category measurement pricing parse
  //         const measurementPricing = JSON.parse(category.measurementPricing);
  //         // check if measurement exits or not
  //         const mainMeasurement = measurementPricing.find((measure) => {
  //           return measure?.name === customSizeWithKey?.key;
  //         });
  //         if (mainMeasurement) {
  //           const measurement = this.getCustomePrice(
  //             +customSizeWithKey.value,
  //             mainMeasurement?.values,
  //           );
  //           customeSizePrice.push({
  //             name: customSizeWithKey.key,
  //             size: Number(customSizeWithKey.value),
  //             price: Number(measurement),
  //           });
  //         } else {
  //           customeSizePrice.push({
  //             name: customSizeWithKey.key,
  //             size: Number(customSizeWithKey.value),
  //             price: 0,
  //           });
  //         }
  //       }
  //     }

  //     // custome size amount
  //     let customeSizePriceAmount = customeSizePrice.reduce(
  //       (total, size) => total + size.price,
  //       0,
  //     );

  //     // if discount valid then calculate total price with discount
  //     const calcTotalPrice = checkDiscountValidation(
  //       true,
  //       sku.discountedPrice,
  //       sku.discountedPriceStart,
  //       sku.discountedPriceEnd,
  //     )
  //       ? sku.discountedPrice * quantity +
  //       customeSizePriceAmount * quantity +
  //       ((sku.vat * sku.discountedPrice) / 100) * quantity
  //       : sku.price * quantity +
  //       customeSizePriceAmount * quantity +
  //       ((sku.vat * sku.price) / 100) * quantity;

  //     return {
  //       productId: sku.product.id,
  //       skuId: sku.id,
  //       sku: sku.sku,
  //       customSku: sku.customSku,
  //       name: sku.product.name,
  //       slug: sku.product.slug,
  //       purchasePrice: sku.purchasePrice,
  //       price: sku.price,
  //       discountedPrice: checkDiscountValidation(
  //         true,
  //         sku.discountedPrice,
  //         sku.discountedPriceStart,
  //         sku.discountedPriceEnd,
  //       )
  //         ? sku.discountedPrice
  //         : 0,
  //       quantity: quantity,
  //       vat: sku.vat,
  //       insideDhaka: sku.product.insideDhaka,
  //       outsideDhaka: sku.product.outsideDhaka,
  //       warrantyType: sku.product.warrantyType,
  //       warranty: sku.product.warranty,
  //       custom_sizes: JSON.stringify(customeSizePrice),
  //       customeSize: JSON.stringify(customeSizePrice),
  //       // measurementSize: matchProduct?.measurementSize,
  //       // add vat to total price
  //       // totalPrice:
  //       //   sku.discountedPrice * quantity +
  //       //   ((sku.vat * sku.discountedPrice) / 100) * quantity,
  //       totalPrice: calcTotalPrice,
  //       ...(sku.product.brand && { brand: sku.product.brand.name }),
  //       categoryId: sku.product?.category?.id,
  //       brandId: sku.product?.brand?.id,
  //       thumbnail: sku.product.thumbnail,
  //       attributes:
  //         sku?.attributes?.map((item) => ({
  //           key: item.key,
  //           value: item.value,
  //         })) || [],
  //       // attributes:
  //       //   matchProduct?.attributes?.map((item) => ({
  //       //     key: item.key,
  //       //     value: item.value,
  //       //   })) || [],
  //       discount: checkDiscountValidation(
  //         true,
  //         sku.discountedPrice,
  //         sku.discountedPriceStart,
  //         sku.discountedPriceEnd,
  //       ),
  //       status: 'Order Placed',
  //     };
  //   });

  //   skus = await Promise.all(skus);

  //   // Get Shipping Address
  //   let shippingCountry;
  //   let billingCountry;
  //   let shippingCity;
  //   let billingCity;
  //   let shippingThana;
  //   let billingThana;
  //   let shippingArea;
  //   let billingArea;
  //   try {
  //     if (createOrderDto?.shippingCountryId) {
  //       shippingCountry = await this.countryRepository.findOne({
  //         where: { id: createOrderDto.shippingCountryId },
  //       });
  //     }

  //     if (createOrderDto?.shippingCityId) {
  //       shippingCity = await this.cityRepository.findOne({
  //         where: { id: createOrderDto.shippingCityId },
  //       });
  //     }

  //     if (createOrderDto?.shippingThanaId) {
  //       shippingThana = await this.thanaRepository.findOne({
  //         where: { id: createOrderDto.shippingThanaId },
  //       });
  //     }

  //     if (createOrderDto?.shippingAreaId) {
  //       shippingArea = await this.areaRepository.findOne({
  //         where: { id: createOrderDto.shippingAreaId },
  //       });
  //     }

  //     if (createOrderDto?.billingCountryId) {
  //       billingCountry = await this.countryRepository.findOne({
  //         where: { id: createOrderDto.billingCountryId },
  //       });
  //     }
  //     if (createOrderDto?.billingCityId) {
  //       billingCity = await this.cityRepository.findOne({
  //         where: { id: createOrderDto.billingCityId },
  //       });
  //     }

  //     if (createOrderDto?.billingThanaId) {
  //       billingThana = await this.thanaRepository.findOne({
  //         where: { id: createOrderDto.billingThanaId },
  //       });
  //     }

  //     if (createOrderDto?.billingAreaId) {
  //       billingArea = await this.areaRepository.findOne({
  //         where: { id: createOrderDto.billingAreaId },
  //       });
  //     }
  //   } catch (e) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }

  //   // if (!shippingCountry) throwError(400, [], 'Invalid shipping country');
  //   // if (!billingCountry) throwError(400, [], 'Invalid billing country');
  //   // if (!shippingCity) throwError(400, [], 'Invalid shipping city');
  //   // if (!billingCity) throwError(400, [], 'Invalid billing city');
  //   // if (!shippingThana) throwError(400, [], 'Invalid shipping thana');
  //   // if (!billingThana) throwError(400, [], 'Invalid billing thana');
  //   // if (!shippingArea) throwError(400, [], 'Invalid shipping area');
  //   // if (!billingArea) throwError(400, [], 'Invalid billing area');

  //   //
  //   // Prepare shipping data
  //   const shipping = {
  //     shippingName: createOrderDto?.shippingName
  //       ? createOrderDto.shippingName
  //       : null,
  //     shippingPhone: createOrderDto?.shippingPhone
  //       ? createOrderDto.shippingPhone
  //       : null,
  //     shippingEmail: createOrderDto?.shippingEmail
  //       ? createOrderDto.shippingEmail
  //       : null,
  //     // shippingCountry: shippingCountry.name,
  //     // shippingCity: shippingCity.name,
  //     shippingStreet: createOrderDto?.shippingStreet
  //       ? createOrderDto.shippingStreet
  //       : null,
  //     shippingPostalCode: createOrderDto?.shippingPostalCode
  //       ? createOrderDto.shippingPostalCode
  //       : null,
  //     shippingLat: createOrderDto?.shippingLat
  //       ? createOrderDto.shippingLat
  //       : null,
  //     shippingLon: createOrderDto?.shippingLon
  //       ? createOrderDto.shippingLon
  //       : null,
  //   };

  //   if (shippingCountry) {
  //     shipping['shippingCountry'] = shippingCountry.name;
  //   }

  //   if (shippingCity) {
  //     shipping['shippingCity'] = shippingCity.name;
  //   }

  //   if (shippingThana) {
  //     shipping['shippingThana'] = shippingThana.name;
  //   }

  //   if (shippingArea) {
  //     shipping['shippingArea'] = shippingArea.name;
  //   }

  //   // Prepare billing data
  //   const billing = {
  //     billingName: createOrderDto?.billingName
  //       ? createOrderDto.billingName
  //       : null,
  //     billingPhone: createOrderDto?.billingPhone
  //       ? createOrderDto.billingPhone
  //       : null,
  //     billingEmail: createOrderDto?.billingEmail
  //       ? createOrderDto.billingEmail
  //       : null,
  //     // billingCountry: billingCountry.name,
  //     // billingCity: billingCity.name,
  //     billingStreet: createOrderDto?.billingStreet
  //       ? createOrderDto.billingStreet
  //       : null,
  //     billingPostalCode: createOrderDto?.billingPostalCode
  //       ? createOrderDto.billingPostalCode
  //       : null,
  //     billingLat: createOrderDto?.billingLat ? createOrderDto.billingLat : null,
  //     billingLon: createOrderDto?.billingLon ? createOrderDto.billingLon : null,
  //   };

  //   if (billingCountry) {
  //     billing['billingCountry'] = billingCountry.name;
  //   }

  //   if (billingCity) {
  //     billing['billingCity'] = billingCity.name;
  //   }

  //   if (billingThana) {
  //     billing['billingThana'] = billingThana.name;
  //   }

  //   if (billingArea) {
  //     billing['billingArea'] = billingArea.name;
  //   }

  //   const status = 'Pending';
  //   // createOrderDto?.paymentMethod === 'COD' ||
  //   // createOrderDto?.paymentMethod === 'cod_with_card'
  //   //   ? 'Pending'
  //   //   : 'Order Placed';

  //   const orderData = {
  //     orderNumber: generateOrderNumber(),
  //     userId: user.id,
  //     type: createOrderDto?.type ? createOrderDto?.type : null,
  //     shopId: createOrderDto?.shopId ? createOrderDto?.shopId : null,
  //     subtotal: 0,
  //     deliveryCharge: 0,
  //     grandTotal: 0,
  //     due: 0,
  //     paid: 0,
  //     discount: 0,
  //     offerId: null,
  //     paymentStatus: PaymentStatus.UNPAID,
  //     skus: skus,
  //     ...shipping,
  //     ...billing,
  //     additionalPhone: createOrderDto.additionalPhone,
  //     note: createOrderDto.note,
  //     preOrderAmount: preOrderAmount,
  //     paymentMethod: createOrderDto?.paymentMethod,
  //     status: status,
  //     orderPlacedByType: admin.type,
  //     orderPlacedById: admin.id
  //   };

  //   const deliverCharge = await this.calculateDeliveryCharge(
  //     shippingCity?.id,
  //     skus,
  //   );
  //   // return deliverCharge;

  //   // Calculate Summary
  //   orderData.subtotal = skus.reduce((a, b) => a + b.totalPrice, 0);
  //   orderData.deliveryCharge = deliverCharge;
  //   if (
  //     preOrderAmount &&
  //     createOrderDto?.type === 'pre-order' &&
  //     createOrderDto?.shopId !== null
  //   ) {
  //     orderData.deliveryCharge = 0;
  //   }
  //   orderData.grandTotal = orderData.subtotal;

  //   // check any free delivery found or not
  //   if (createOrderDto?.offerId === null || createOrderDto?.offerId === 0) {
  //     const freeDeliveryData = await this.offerService.checkFreeDelivery(
  //       orderData.grandTotal,
  //     );
  //     if (freeDeliveryData && freeDeliveryData.status === true) {
  //       orderData.deliveryCharge = 0;
  //     }
  //   }

  //   orderData.discount = 0;
  //   if (createOrderDto.offerId) {
  //     const offerData = await this.offerService.calculateOffer(
  //       user,
  //       orderData.deliveryCharge,
  //       orderData.grandTotal,
  //       createOrderDto.offerId,
  //     );

  //     if (offerData && offerData.status === true) {
  //       if (offerData?.type === 'discount') {
  //         orderData.discount = offerData.discountAmount
  //           ? offerData.discountAmount
  //           : 0;

  //         if (offerData?.offer?.isFreeDelivery) {
  //           orderData.deliveryCharge = 0;
  //         }
  //       } else if (offerData?.type === 'free_delivery') {
  //         orderData.deliveryCharge = 0;
  //       }

  //       orderData.grandTotal =
  //         orderData.grandTotal - orderData.discount + orderData.deliveryCharge;
  //       orderData.offerId = createOrderDto.offerId;
  //       orderData.due = orderData.grandTotal;
  //     } else {
  //       throwError(400, [], 'Invalid offer');
  //     }

  //     console.log(offerData);
  //   } else {
  //     orderData.grandTotal = orderData.grandTotal + orderData.deliveryCharge;
  //   }

  //   orderData.due = orderData.grandTotal;
  //   orderData.paid = 0;

  //   // Store data to database with transaction
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   let insertedOrder;
  //   try {
  //     const { skus, ...data } = { ...orderData };

  //     const newOrder = await queryRunner.manager
  //       .getRepository('order')
  //       .save(data);

  //     // if new order is created then remove from cart
  //     if (newOrder['orderNumber']) {
  //       for (const product of skus) {
  //         await queryRunner.manager
  //           .getRepository('cart')
  //           .delete({ skuId: product.skuId, userId: user.id });
  //       }
  //     }

  //     for (const product of skus) {
  //       const attributes = product.attributes;
  //       // const gng_gift = JSON.stringify(product.gng_gift);
  //       // const brand_gift = JSON.stringify(product.brand_gift);
  //       // const custom_sizes = JSON.stringify(product.custom_sizes);
  //       delete product.attributes;
  //       delete product.gng_gift;
  //       delete product.brand_gift;
  //       // console.log('product=====> ', product);

  //       // Parsing gng_gift and brand_gift
  //       // createOrderDto.gng_gift = createOrderDto.gng_gift ? JSON.parse(createOrderDto.gng_gift) : [];
  //       // createOrderDto.brand_gift = createOrderDto.brand_gift ? JSON.parse(createOrderDto.brand_gift) : [];

  //       const newProduct = await queryRunner.manager
  //         .getRepository('order_product')
  //         .save({
  //           orderId: newOrder.id,
  //           ...product,
  //           // gng_gift: gng_gift,
  //           // brand_gift: brand_gift,
  //           // custom_sizes: custom_sizes,
  //           status: 'Order Placed',
  //         });

  //       // Decrease product sku quantity
  //       // await queryRunner.manager
  //       //   .getRepository('sku')
  //       //   .update(
  //       //     { id: product.skuId },
  //       //     { stockQuantity: () => `stock_quantity - ${product.quantity}` },
  //       //   );

  //       // insert product attributes
  //       const attributeData = attributes.map((attribute) => {
  //         return {
  //           orderProductId: newProduct.id,
  //           key: attribute.key,
  //           value: attribute.value,
  //         };
  //       });

  //       if (attributeData.length > 0) {
  //         await queryRunner.manager
  //           .getRepository('order_product_attribute')
  //           .save(attributeData);
  //       }
  //     }

  //     // Insert into order timeline table
  //     await queryRunner.manager
  //       .getRepository('order_timeline')
  //       .save({ orderId: newOrder.id, status: newOrder.status });

  //     // Insert In system notification for customer
  //     await queryRunner.manager.getRepository('notification').save({
  //       userId: user.id,
  //       userType: UserType.CUSTOMER,
  //       content: `Your order #${newOrder?.orderNumber} has been placed successfully.`,
  //       type: 'order',
  //       param: newOrder?.orderNumber,
  //     });

  //     // Insert In system notification for admin
  //     await queryRunner.manager.getRepository('notification').save({
  //       userType: UserType.ADMIN,
  //       content: `You received a new Order #${newOrder.orderNumber}`,
  //       type: 'order',
  //       param: newOrder.id,
  //     });

  //     await queryRunner.commitTransaction();

  //     insertedOrder = await this.orderRepository.findOne({
  //       where: { id: newOrder.id },
  //       relations: [
  //         'products',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'timeline',
  //         'offer',
  //         'user',
  //       ],
  //       select: {
  //         user: {
  //           id: true,
  //           avatar: true,
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //           phone: true,
  //           status: true,
  //         },
  //       },
  //     });

  //     // save order log data
  //     await this.saveOrderLog(
  //       null,
  //       insertedOrder,
  //       OrderLogStatus.ORDER_PLACED,
  //       'order placed',
  //       null,
  //       insertedOrder,
  //     );

  //     // email send to user
  //     if (insertedOrder && insertedOrder?.user?.email !== null) {
  //       const orderRequestData = {
  //         userName:
  //           insertedOrder?.user?.firstName +
  //           ' ' +
  //           insertedOrder?.user?.lastName,
  //         email: insertedOrder?.user?.email,
  //         orderNumber: insertedOrder?.orderNumber,
  //         link: `${process.env.FRONTEND_URL}/order-details?id=${insertedOrder?.orderNumber}`,
  //       };
  //       //send to mail server
  //       await this.mailService.sendOrderEmail(orderRequestData);
  //     }

  //     // await queryRunner.release();

  //     // await queryRunner.manager.getRepository('order_log').save({
  //     //   userId: null,
  //     //   orderId: newOrder.id,
  //     //   type: OrderLogStatus.ORDER_PLACED,
  //     //   message: 'Order Placed',
  //     //   oldData: null,
  //     //   newData: JSON.stringify(insertedOrder),
  //     // });
  //   } catch (e) {
  //     console.log(e);
  //     await queryRunner.rollbackTransaction();
  //     await queryRunner.release();
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   } finally {
  //     await queryRunner.release();
  //   }

  //   return {
  //     orderNumber: insertedOrder.orderNumber,
  //     grandTotal: insertedOrder.grandTotal,
  //     orderData: insertedOrder,
  //   };
  // }

  // // update stock from warehouse and sku of order quantity
  // async updateStock(orderId: number, updateStockDto: UpdateStockDto[]) {
  //   const orderProducts = await this.orderProductRepository.find({
  //     where: { orderId: orderId, orderConfirm: false },
  //   });
  //   if (!orderProducts || !orderProducts?.length) {
  //     throw new NotFoundException(
  //       'order products not found or maybe already updated',
  //     );
  //   }
  //   const orderProductMap = new Map(
  //     orderProducts.map((product) => [Number(product.skuId), product]),
  //   );

  //   // start transaction
  //   return await this.dataSource.transaction(async (manager) => {
  //     // update stock quantity from warehouse stock
  //     const updateWarehousePromises = updateStockDto.map(async (stock) => {
  //       const product = orderProductMap.get(stock.skuId);
  //       if (!product) {
  //         throw new BadRequestException('sku product not found');
  //       }

  //       const warehouseUpdateCount = await manager
  //         .getRepository('warehouse_skus_stock')
  //         .update(
  //           {
  //             skuId: stock.skuId,
  //             warehouseId: stock.warehouseId,
  //             qty: Not(LessThan(product.quantity)),
  //           },
  //           {
  //             qty: () => `qty - ${product.quantity}`,
  //           },
  //         );

  //       if (!warehouseUpdateCount.affected) {
  //         throw new NotFoundException(
  //           `stock not found for skuId: ${stock.skuId} & warehouseId: ${stock.warehouseId} in warehouse_skus_stock table`,
  //         );
  //       }

  //       // update stock quantity from sku
  //       const skuUpdateCount = await manager.getRepository('sku').update(
  //         {
  //           id: stock.skuId,
  //           stockQuantity: Not(LessThan(product.quantity)),
  //         },
  //         {
  //           stockQuantity: () => `stock_quantity - ${product.quantity}`,
  //         },
  //       );

  //       if (!skuUpdateCount.affected) {
  //         throw new NotFoundException(
  //           `stock not found for skuId: ${stock.skuId} in sku table`,
  //         );
  //       }

  //       // update stock quantity from sku
  //       const orderProductUpdateCount = await manager
  //         .getRepository('order_product')
  //         .update(
  //           {
  //             id: product.id,
  //           },
  //           {
  //             orderConfirm: true,
  //             warehouseId: stock.warehouseId,
  //           },
  //         );

  //       if (!orderProductUpdateCount.affected) {
  //         throw new NotFoundException(
  //           `orderConfirmed failed to update in order product`,
  //         );
  //       }

  //       return [skuUpdateCount, warehouseUpdateCount, orderProductUpdateCount];
  //     });

  //     await Promise.all([...updateWarehousePromises.flat()]);
  //   });
  // }

  // // update stock from warehouse and sku of order quantity
  // async getAvailableWarehouse(orderId: number) {
  //   const orderProducts = await this.orderProductRepository.find({
  //     where: { orderId: orderId },
  //     select: ['id', 'skuId', 'quantity'],
  //   });
  //   if (!orderProducts || !orderProducts?.length) {
  //     throw new NotFoundException('order not found');
  //   }

  //   const skuIds = orderProducts.map((product) => product.skuId);
  //   const warehouseStocks = await this.warehouseSkusStockRepository.find({
  //     where: { skuId: In(skuIds) },
  //     relations: ['warehouses'],
  //   });

  //   const orderProductQtyMap = new Map(
  //     orderProducts.map((product) => [product.skuId, product.quantity]),
  //   );
  //   const skuWarehouses = new Map();

  //   // generate response
  //   warehouseStocks.forEach((stock) => {
  //     const existedWarehouses = skuWarehouses.get(stock.skuId);
  //     const orderedQuantity = orderProductQtyMap.get(stock.skuId);
  //     console.log(stock.skuId);

  //     if (!existedWarehouses && orderedQuantity <= stock.qty) {
  //       skuWarehouses.set(stock.skuId, [
  //         {
  //           skuId: stock.skuId,
  //           warehouseId: stock.warehouseId,
  //           qty: stock.qty,
  //           warehouseName: stock.warehouses.name,
  //           warehouseAddress: stock.warehouses.address,
  //         },
  //       ]);
  //     } else if (orderedQuantity <= stock.qty) {
  //       skuWarehouses.set(stock.skuId, [
  //         ...existedWarehouses,
  //         {
  //           skuId: stock.skuId,
  //           warehouseId: stock.warehouseId,
  //           qty: stock.qty,
  //           warehouseName: stock.warehouses.name,
  //           warehouseAddress: stock.warehouses.address,
  //         },
  //       ]);
  //     }
  //   });

  //   const response = [...skuWarehouses].map(([skuId, warehouses]) => {
  //     return {
  //       skuId,
  //       warehouses,
  //     };
  //   });

  //   return response;
  // }

  // // create emi order
  // async createEmi(user, createOrderDto: CreateEmiOrderDto) {
  //   // validate phone number
  //   const shippingPhone = checkPhoneNumberValidation(
  //     createOrderDto.shippingPhone,
  //   );
  //   const billingPhone = checkPhoneNumberValidation(
  //     createOrderDto.billingPhone,
  //   );
  //   if (!shippingPhone || !billingPhone) {
  //     throwError(400, [], 'Invalid phone number');
  //   }
  //   // Get and Check order skus
  //   if (createOrderDto.products.length === 0)
  //     throwError(400, [], 'Invalid products');
  //   let products;
  //   try {
  //     products = await this.skuRepository.find({
  //       where: {
  //         id: In(createOrderDto.products.map((product) => product.skuId)),
  //       },
  //       relations: [
  //         'product',
  //         'attributes',
  //         'product.category',
  //         'product.brand',
  //       ],
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  //   }

  //   if (products.length !== createOrderDto.products.length) {
  //     throwError(400, [], 'Invalid products');
  //   }

  //   if (!products[0].product.gift) {
  //     throwError(400, [], 'EMI not available for this product');
  //   }

  //   const productGift = JSON.parse(products[0].product.gift);
  //   // check emi available or not
  //   if (productGift?.EMI?.selected === false) {
  //     throwError(400, [], 'EMI not available for this product');
  //   }

  //   const emiType = productGift?.EMI?.emiTypes;
  //   let emiTenureMonth = [];
  //   let emiSelectedMonth = '';
  //   let emiTenures = null;
  //   if (emiType[0] === 'on-demand') {
  //     emiTenureMonth.push(tenureMonth(createOrderDto?.tenures).toString());
  //     emiSelectedMonth = `${tenureMonth(
  //       createOrderDto?.tenures,
  //     ).toString()} Month`;
  //     emiTenures = productGift?.EMI?.emiTenors.find((tenure) => {
  //       return tenure.name === createOrderDto?.tenures;
  //     });
  //   } else if (emiType[0] === 'online') {
  //     emiSelectedMonth = `Choose emi by user`;
  //     for (let i = 0; i < productGift?.EMI?.emiTenors.length; i++) {
  //       const tenor = productGift?.EMI?.emiTenors[i];
  //       emiTenureMonth.push(tenor.name.split(' ')[0]);
  //     }
  //   }

  //   let skus = [];
  //   let preOrderAmount;

  //   // return products;
  //   skus = products.map((sku) => {
  //     // Check quantity is valid
  //     // console.log(sku);
  //     const quantity = createOrderDto.products.find(
  //       (item) => item.skuId == sku.id,
  //     ).quantity;

  //     if (quantity > sku.quantity) throwError(400, [], 'Invalid quantity');

  //     preOrderAmount = sku?.preOrderPer ? sku?.preOrderPer : null;

  //     // Check product is active or not
  //     if (sku.product.status !== ProductStatus.ACTIVE)
  //       throwError(400, [], 'Product is not active');

  //     const matchProduct = createOrderDto.products.find(
  //       (item) => item.skuId === sku.id,
  //     );

  //     // if discount valid then calculate total price with discount
  //     const calcTotalPrice = checkDiscountValidation(
  //       matchProduct?.discount,
  //       sku.discountedPrice,
  //       sku.discountedPriceStart,
  //       sku.discountedPriceEnd,
  //     )
  //       ? sku.discountedPrice * quantity +
  //       ((sku.vat * sku.discountedPrice) / 100) * quantity
  //       : sku.price * quantity + ((sku.vat * sku.price) / 100) * quantity;

  //     return {
  //       productId: sku.product.id,
  //       skuId: sku.id,
  //       sku: sku.sku,
  //       customSku: sku.customSku,
  //       name: sku.product.name,
  //       slug: sku.product.slug,
  //       purchasePrice: sku.purchasePrice,
  //       price: sku.price,
  //       discountedPrice: checkDiscountValidation(
  //         matchProduct?.discount,
  //         sku.discountedPrice,
  //         sku.discountedPriceStart,
  //         sku.discountedPriceEnd,
  //       )
  //         ? sku.discountedPrice
  //         : 0,
  //       quantity: quantity,
  //       vat: sku.vat,
  //       insideDhaka: sku.product.insideDhaka,
  //       outsideDhaka: sku.product.outsideDhaka,
  //       warrantyType: sku.product.warrantyType,
  //       warranty: sku.product.warranty,
  //       // add vat to total price
  //       // totalPrice:
  //       //   sku.discountedPrice * quantity +
  //       //   ((sku.vat * sku.discountedPrice) / 100) * quantity,
  //       totalPrice: calcTotalPrice,
  //       ...(sku.product.brand && { brand: sku.product.brand.name }),
  //       categoryId: sku.product?.category?.id,
  //       thumbnail: sku.product.thumbnail,
  //       attributes:
  //         sku?.attributes?.map((item) => ({
  //           key: item.key,
  //           value: item.value,
  //         })) || [],
  //       // attributes:
  //       //   matchProduct?.attributes?.map((item) => ({
  //       //     key: item.key,
  //       //     value: item.value,
  //       //   })) || [],
  //       // gng_gift: matchProduct?.gng_gift || [],
  //       // brand_gift: matchProduct?.brand_gift || [],
  //       discount: matchProduct?.discount,
  //       status: 'Order Placed',
  //     };
  //   });

  //   // Get Shipping Address
  //   let shippingCountry;
  //   let billingCountry;
  //   let shippingCity;
  //   let billingCity;
  //   let shippingThana;
  //   let billingThana;
  //   let shippingArea;
  //   let billingArea;
  //   try {
  //     if (createOrderDto?.shippingCountryId) {
  //       shippingCountry = await this.countryRepository.findOne({
  //         where: { id: createOrderDto.shippingCountryId },
  //       });
  //     }

  //     if (createOrderDto?.shippingCityId) {
  //       shippingCity = await this.cityRepository.findOne({
  //         where: { id: createOrderDto.shippingCityId },
  //       });
  //     }

  //     if (createOrderDto?.shippingThanaId) {
  //       shippingThana = await this.thanaRepository.findOne({
  //         where: { id: createOrderDto.shippingThanaId },
  //       });
  //     }

  //     if (createOrderDto?.shippingAreaId) {
  //       shippingArea = await this.areaRepository.findOne({
  //         where: { id: createOrderDto.shippingAreaId },
  //       });
  //     }

  //     if (createOrderDto?.billingCountryId) {
  //       billingCountry = await this.countryRepository.findOne({
  //         where: { id: createOrderDto.billingCountryId },
  //       });
  //     }
  //     if (createOrderDto?.billingCityId) {
  //       billingCity = await this.cityRepository.findOne({
  //         where: { id: createOrderDto.billingCityId },
  //       });
  //     }

  //     if (createOrderDto?.billingThanaId) {
  //       billingThana = await this.thanaRepository.findOne({
  //         where: { id: createOrderDto.billingThanaId },
  //       });
  //     }

  //     if (createOrderDto?.billingAreaId) {
  //       billingArea = await this.areaRepository.findOne({
  //         where: { id: createOrderDto.billingAreaId },
  //       });
  //     }
  //   } catch (e) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }

  //   // if (!shippingCountry) throwError(400, [], 'Invalid shipping country');
  //   // if (!billingCountry) throwError(400, [], 'Invalid billing country');
  //   // if (!shippingCity) throwError(400, [], 'Invalid shipping city');
  //   // if (!billingCity) throwError(400, [], 'Invalid billing city');
  //   // if (!shippingThana) throwError(400, [], 'Invalid shipping thana');
  //   // if (!billingThana) throwError(400, [], 'Invalid billing thana');
  //   // if (!shippingArea) throwError(400, [], 'Invalid shipping area');
  //   // if (!billingArea) throwError(400, [], 'Invalid billing area');

  //   // Prepare shipping data
  //   const shipping = {
  //     shippingName: createOrderDto.shippingName,
  //     shippingPhone: createOrderDto.shippingPhone,
  //     ...(createOrderDto.shippingEmail && {
  //       shippingEmail: createOrderDto.shippingEmail,
  //     }),
  //     // shippingCountry: shippingCountry.name,
  //     // shippingCity: shippingCity.name,
  //     shippingStreet: createOrderDto.shippingStreet,
  //     shippingPostalCode: createOrderDto.shippingPostalCode,
  //     shippingLat: createOrderDto.shippingLat,
  //     shippingLon: createOrderDto.shippingLon,
  //   };

  //   if (shippingCountry) {
  //     shipping['shippingCountry'] = shippingCountry.name;
  //   }

  //   if (shippingCity) {
  //     shipping['shippingCity'] = shippingCity.name;
  //   }

  //   if (shippingThana) {
  //     shipping['shippingThana'] = shippingThana.name;
  //   }

  //   if (shippingArea) {
  //     shipping['shippingArea'] = shippingArea.name;
  //   }

  //   // Prepare billing data
  //   const billing = {
  //     billingName: createOrderDto.billingName,
  //     billingPhone: createOrderDto.billingPhone,
  //     ...(createOrderDto.billingEmail && {
  //       billingEmail: createOrderDto.billingEmail,
  //     }),
  //     // billingCountry: billingCountry.name,
  //     // billingCity: billingCity.name,
  //     billingStreet: createOrderDto.billingStreet,
  //     billingPostalCode: createOrderDto.billingPostalCode,
  //     billingLat: createOrderDto.billingLat,
  //     billingLon: createOrderDto.billingLon,
  //   };

  //   if (billingCountry) {
  //     billing['billingCountry'] = billingCountry.name;
  //   }

  //   if (billingCity) {
  //     billing['billingCity'] = billingCity.name;
  //   }

  //   if (billingThana) {
  //     billing['billingThana'] = billingThana.name;
  //   }

  //   if (billingArea) {
  //     billing['billingArea'] = billingArea.name;
  //   }

  //   const status = 'Pending';
  //   // createOrderDto?.paymentMethod === 'COD' ||
  //   // createOrderDto?.paymentMethod === 'cod_with_card'
  //   //   ? 'Pending'
  //   //   : 'Order Placed';

  //   const orderData = {
  //     orderNumber: generateOrderNumber(),
  //     emi: true,
  //     emiType: emiType[0],
  //     emiTenure: emiTenureMonth.join(),
  //     emiSelectedMonth: emiSelectedMonth,
  //     userId: user.id,
  //     type: createOrderDto?.type ? createOrderDto?.type : null,
  //     shopId: createOrderDto?.shopId ? createOrderDto?.shopId : null,
  //     subtotal: 0,
  //     deliveryCharge: 0,
  //     grandTotal: 0,
  //     due: 0,
  //     paid: 0,
  //     discount: 0,
  //     offerId: null,
  //     paymentStatus: PaymentStatus.UNPAID,
  //     skus: skus,
  //     ...shipping,
  //     ...billing,
  //     note: createOrderDto.note,
  //     paymentMethod: createOrderDto?.paymentMethod,
  //     preOrderAmount: preOrderAmount,
  //     status: status,
  //   };

  //   const deliverCharge = await this.calculateDeliveryCharge(
  //     shippingCity.id,
  //     skus,
  //   );
  //   // return deliverCharge;

  //   // Calculate Summary
  //   orderData.subtotal = skus.reduce((a, b) => a + b.totalPrice, 0);
  //   // sub total and delivery charge
  //   // const subtotalAndDeliveryCharge = orderData.subtotal + deliverCharge;

  //   // emi amount
  //   let emiAmount = 0;
  //   if (emiType[0] === 'on-demand' && emiTenures?.percent) {
  //     emiAmount = (orderData.subtotal * emiTenures?.percent) / 100;
  //   }
  //   // orderData.subtotal + orderData.deliveryCharge + emiAmount;
  //   orderData.deliveryCharge = deliverCharge;
  //   if (
  //     preOrderAmount &&
  //     createOrderDto?.type === 'pre-order' &&
  //     createOrderDto?.shopId !== null
  //   ) {
  //     orderData.deliveryCharge = 0;
  //   }
  //   orderData.grandTotal = orderData.subtotal + deliverCharge + emiAmount;
  //   orderData.due = orderData.grandTotal;
  //   orderData.paid = 0;

  //   orderData.discount = 0;
  //   if (createOrderDto.offerId) {
  //     const offerData = await this.offerService.calculateOffer(
  //       user,
  //       orderData.deliveryCharge,
  //       orderData.grandTotal,
  //       createOrderDto.offerId,
  //     );

  //     if (offerData && offerData.status === true) {
  //       orderData.discount = offerData.discountAmount
  //         ? offerData.discountAmount
  //         : 0;

  //       orderData.grandTotal = orderData.grandTotal - orderData.discount;
  //       orderData.offerId = createOrderDto.offerId;
  //       orderData.due = orderData.grandTotal;
  //     } else {
  //       throwError(400, [], 'Invalid offer');
  //     }

  //     console.log(offerData);
  //   }

  //   // Store data to database with transaction
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   let insertedOrder;
  //   try {
  //     const { skus, ...data } = { ...orderData };
  //     const newOrder = await queryRunner.manager
  //       .getRepository('order')
  //       .save(data);

  //     // if new order is created then remove from cart
  //     if (newOrder['orderNumber']) {
  //       for (const product of skus) {
  //         await queryRunner.manager
  //           .getRepository('cart')
  //           .delete({ skuId: product.skuId, userId: user.id });
  //       }
  //     }

  //     for (const product of skus) {
  //       const attributes = product.attributes;
  //       // const gng_gift = JSON.stringify(product.gng_gift);
  //       // const brand_gift = JSON.stringify(product.brand_gift);
  //       delete product.attributes;
  //       delete product.gng_gift;
  //       delete product.brand_gift;
  //       // console.log('product=====> ', product);

  //       // Parsing gng_gift and brand_gift
  //       // createOrderDto.gng_gift = createOrderDto.gng_gift ? JSON.parse(createOrderDto.gng_gift) : [];
  //       // createOrderDto.brand_gift = createOrderDto.brand_gift ? JSON.parse(createOrderDto.brand_gift) : [];

  //       const newProduct = await queryRunner.manager
  //         .getRepository('order_product')
  //         .save({
  //           orderId: newOrder.id,
  //           ...product,
  //           // gng_gift: gng_gift,
  //           // brand_gift: brand_gift,
  //           status: 'Order Placed',
  //         });

  //       // Decrease product sku quantity
  //       await queryRunner.manager
  //         .getRepository('sku')
  //         .update(
  //           { id: product.skuId },
  //           { stockQuantity: () => `stock_quantity - ${product.quantity}` },
  //         );

  //       // insert product attributes
  //       const attributeData = attributes.map((attribute) => {
  //         return {
  //           orderProductId: newProduct.id,
  //           key: attribute.key,
  //           value: attribute.value,
  //         };
  //       });

  //       if (attributeData.length > 0) {
  //         await queryRunner.manager
  //           .getRepository('order_product_attribute')
  //           .save(attributeData);
  //       }
  //     }

  //     // Insert into order timeline table
  //     await queryRunner.manager
  //       .getRepository('order_timeline')
  //       .save({ orderId: newOrder.id, status: newOrder.status });

  //     // Insert In system notification for customer
  //     await queryRunner.manager.getRepository('notification').save({
  //       userId: user.id,
  //       userType: UserType.CUSTOMER,
  //       content: `Your order #${newOrder?.orderNumber} has been placed successfully.`,
  //       type: 'order',
  //       param: newOrder?.orderNumber,
  //     });

  //     // Insert In system notification for admin
  //     await queryRunner.manager.getRepository('notification').save({
  //       userType: UserType.ADMIN,
  //       content: `You received a new Order #${newOrder.orderNumber}`,
  //       type: 'order',
  //       param: newOrder.id,
  //     });

  //     await queryRunner.commitTransaction();

  //     insertedOrder = await this.orderRepository.findOne({
  //       where: { id: newOrder.id },
  //       relations: [
  //         'products',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'timeline',
  //         'offer',
  //         'user',
  //       ],
  //       select: {
  //         user: {
  //           id: true,
  //           avatar: true,
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //           phone: true,
  //           status: true,
  //         },
  //       },
  //     });

  //     // save order log data
  //     await this.saveOrderLog(
  //       null,
  //       insertedOrder,
  //       OrderLogStatus.ORDER_PLACED,
  //       'order placed',
  //       null,
  //       insertedOrder,
  //     );
  //     // await queryRunner.release();

  //     // await queryRunner.manager.getRepository('order_log').save({
  //     //   userId: null,
  //     //   orderId: newOrder.id,
  //     //   type: OrderLogStatus.ORDER_PLACED,
  //     //   message: 'Order Placed',
  //     //   oldData: null,
  //     //   newData: JSON.stringify(insertedOrder),
  //     // });
  //   } catch (e) {
  //     console.log(e);
  //     await queryRunner.rollbackTransaction();
  //     await queryRunner.release();
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   } finally {
  //     await queryRunner.release();
  //   }

  //   return {
  //     orderNumber: insertedOrder.orderNumber,
  //     grandTotal: insertedOrder.grandTotal,
  //     orderData: insertedOrder,
  //   };
  // }

  // async calculateDeliveryCharge(cityId: number, products: any[]) {
  //   const shippingCity = await this.cityRepository.findOne({
  //     where: { id: cityId },
  //   });

  //   let deliverCharge = 0;

  //   let productMaxDeliveryCharge = 0;
  //   // Calculate Delivery Charge
  //   try {
  //     products?.forEach((product) => {
  //       if (shippingCity.name === 'Dhaka') {
  //         if (productMaxDeliveryCharge < product['insideDhaka']) {
  //           productMaxDeliveryCharge = product['insideDhaka'];
  //         }
  //       } else {
  //         if (productMaxDeliveryCharge < product['outsideDhaka']) {
  //           productMaxDeliveryCharge = product['outsideDhaka'];
  //         }
  //       }
  //     });
  //     console.log('productMaxDeliveryCharge', productMaxDeliveryCharge);
  //     deliverCharge = productMaxDeliveryCharge;
  //   } catch (e) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }

  //   if ((deliverCharge && deliverCharge === null) || deliverCharge === 0) {
  //     let customDeliveryCharge;
  //     try {
  //       customDeliveryCharge = await this.deliveryChargeRepository.findOne({
  //         where: {
  //           cityId: cityId,
  //         },
  //       });
  //     } catch (e) {
  //       throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //     }
  //     if (customDeliveryCharge) {
  //       // Custom delivery charge added
  //       deliverCharge = customDeliveryCharge.charge;
  //     } else {
  //       // Default delivery charge
  //       if (shippingCity.name === 'Dhaka') {
  //         try {
  //           customDeliveryCharge = await this.deliveryChargeRepository.findOne({
  //             where: {
  //               type: DeliveryChargeType.INSIDE_DHAKA,
  //             },
  //           });
  //         } catch (e) {
  //           throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //         }

  //         if (!customDeliveryCharge) deliverCharge = 60;
  //         else deliverCharge = customDeliveryCharge.charge;
  //       } else {
  //         try {
  //           customDeliveryCharge = await this.deliveryChargeRepository.findOne({
  //             where: {
  //               type: DeliveryChargeType.OUTSIDE_DHAKA,
  //             },
  //           });
  //         } catch (e) {
  //           throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //         }

  //         if (!customDeliveryCharge) deliverCharge = 120;
  //         else deliverCharge = customDeliveryCharge.charge;
  //       }
  //     }
  //   }

  //   console.log('FinalDeliveryCharge', deliverCharge);
  //   return deliverCharge;
  // }

  // /**
  //  * Cancele my order
  //  *
  //  * Customer can cancel his order before order is confirmed by admin
  //  *
  //  * @param user object - Logged in user
  //  * @param orderNumber string - Order number
  //  * @return object  - {status: true, message: 'Order Canceled successfully.'}
  //  *
  //  * @author Mehedi Hassan Durjoi <https://github.com/durjoi>
  //  * @date 2023-03-15 14:42:28
  //  */
  // async cancelMyOrder(user, orderNumber) {
  //   // Find Order by order number and user id
  //   let order;
  //   try {
  //     order = await this.orderRepository.findOne({
  //       where: { orderNumber: orderNumber, userId: user.id },
  //     });
  //   } catch (e) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }

  //   if (!order) {
  //     throwError(HttpStatus.BAD_REQUEST, [], 'Invalid order number.');
  //   }

  //   if (order.status === 'Canceled') {
  //     throwError(HttpStatus.BAD_REQUEST, [], 'Order already Canceled.');
  //   }

  //   if (order.status !== 'Order Placed') {
  //     throwError(
  //       HttpStatus.BAD_REQUEST,
  //       [],
  //       'Order already confirmed by admin. You can not cancel this order.',
  //     );
  //   }

  //   try {
  //     await this.dataSource.transaction(async (manager) => {
  //       await manager
  //         .getRepository('order')
  //         .update({ id: order.id }, { status: 'Canceled' });

  //       const orderProducts = await this.orderProductRepository.find({
  //         where: { orderId: order.id, status: Not('Canceled') },
  //       });

  //       // Increase product sku quantity
  //       for (const product of orderProducts) {
  //         await manager
  //           .getRepository('sku')
  //           .update(
  //             { id: product.skuId },
  //             { stockQuantity: () => `stock_quantity + ${product.quantity}` },
  //           );
  //       }

  //       // update order product status
  //       await manager
  //         .getRepository('order_product')
  //         .update({ orderId: order.id }, { status: 'Canceled' });

  //       // Insert In system notification for customer
  //       await manager.getRepository('notification').save({
  //         userId: user.id,
  //         userType: UserType.CUSTOMER,
  //         type: 'order',
  //         param: order.orderNumber,
  //         content: `Your order #${order.orderNumber} has been Canceled successfully.`,
  //       });

  //       // Insert In system notification for admin
  //       await manager.getRepository('notification').save({
  //         userType: UserType.ADMIN,
  //         type: 'order',
  //         param: order.id,
  //         content: `Order #${order.orderNumber} has been Canceled by customer.`,
  //       });

  //       // Insert into order timeline table
  //       await manager.getRepository('order_timeline').save({
  //         orderId: order.id,
  //         status: 'Canceled',
  //       });
  //     });
  //   } catch (error) {
  //     console.log(error.message);

  //     throwError(
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       [],
  //       'Failed to cancel order.',
  //     );
  //   }
  //   const updatedOrder = await this.orderRepository.findOne({
  //     where: { id: order.id },
  //     relations: ['products', 'products.attributes', 'timeline'],
  //   });

  //   return updatedOrder;
  // }

  // async updateOrderProductDetails(
  //   user,
  //   orderProductId: number,
  //   updateOrderProductDto: UpdateOrderProductDto,
  // ) {
  //   try {
  //     const orderProduct = await this.orderProductRepository.findOne({
  //       where: { id: orderProductId },
  //     });

  //     if (!orderProduct) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Invalid order product id.');
  //     }

  //     // // get order details
  //     // const order = await this.orderRepository.findOne({
  //     //   where: { id: orderProduct.orderId },
  //     // });

  //     // if (!order) {
  //     //   throwError(HttpStatus.BAD_REQUEST, [], 'Invalid order id.');
  //     // }

  //     // // check order delivery or processing
  //     // if (order.status === OrderStatus.Pending) {
  //     //   throwError(
  //     //     HttpStatus.BAD_REQUEST,
  //     //     [],
  //     //     'Order is not delivered or processing.',
  //     //   );
  //     // }

  //     if (orderProduct.status === OrderProductStatus.CANCELLED) {
  //       throwError(
  //         HttpStatus.BAD_REQUEST,
  //         [],
  //         'Order product already Canceled.',
  //       );
  //     }

  //     if (orderProduct.status === OrderProductStatus.DROPPED) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Order product already droped.');
  //     }

  //     if (
  //       orderProduct.status === OrderProductStatus.REPLACE_DAAP ||
  //       orderProduct.status === OrderProductStatus.REPLACE_DOAP
  //     ) {
  //       throwError(
  //         HttpStatus.BAD_REQUEST,
  //         [],
  //         'Order product already replaced.',
  //       );
  //     }

  //     if (
  //       orderProduct.status === OrderProductStatus.REFUND_DAAP ||
  //       orderProduct.status === OrderProductStatus.REFUND_DOAP ||
  //       orderProduct.status === OrderProductStatus.REFUND
  //     ) {
  //       throwError(
  //         HttpStatus.BAD_REQUEST,
  //         [],
  //         'Order product already refunded.',
  //       );
  //     }

  //     try {
  //       await this.dataSource.transaction(async (manager) => {
  //         await manager
  //           .getRepository('order_product')
  //           .update(
  //             { id: orderProductId },
  //             { status: updateOrderProductDto.status },
  //           );

  //         // Increase product sku quantity
  //         // await queryRunner.manager.getRepository('sku').update(
  //         //   { id: orderProduct.skuId },
  //         //   {
  //         //     stockQuantity: () => `stock_quantity + ${orderProduct.quantity}`,
  //         //   },
  //         // );

  //         // decrease order subtotal and delivery charge & gramd total & due
  //         if (updateOrderProductDto.status === OrderProductStatus.CANCELLED) {
  //           await manager.getRepository('order').update(
  //             { id: orderProduct.orderId },
  //             {
  //               subtotal: () => `subtotal - ${orderProduct.totalPrice}`,
  //               due: () => `due - ${orderProduct.totalPrice}`,
  //               grandTotal: () => `grand_total - ${orderProduct.totalPrice}`,
  //             },
  //           );
  //         }

  //         // Decrese order amount
  //         // await queryRunner.manager
  //         //   .getRepository('order')
  //         //   .update(
  //         //     { id: orderProduct.orderId },
  //         //     { quantity: () => `quantity - ${orderProduct.quantity}` },
  //         //   );

  //         // Insert In system notification for customer
  //         await manager.getRepository('notification').save({
  //           userId: user.id,
  //           userType: UserType.CUSTOMER,
  //           type: 'order',
  //           param: orderProduct.orderNumber,
  //           content: `Your order product #${orderProduct.orderNumber} has been Canceled successfully.`,
  //         });

  //         // // Insert In system notification for admin
  //         await manager.getRepository('notification').save({
  //           userType: UserType.ADMIN,
  //           type: 'order',
  //           param: orderProduct.orderId,
  //           content: `Order product #${orderProduct.orderNumber} has been Canceled by customer.`,
  //         });

  //         // Insert into order timeline table
  //         await manager.getRepository('order_timeline').save({
  //           orderId: orderProduct.orderId,
  //           status: 'Canceled',
  //         });
  //       });

  //       // get updated order
  //       const updatedOrder = await this.orderRepository.findOne({
  //         where: { id: orderProduct.orderId },
  //         relations: ['products', 'products.attributes', 'timeline'],
  //       });

  //       return updatedOrder;
  //     } catch (e) {
  //       console.log(e.message);
  //       throwError(
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //         [],
  //         'Failed to update order.',
  //       );
  //     }
  //   } catch (error) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  //   }
  // }

  // // async updateOrderProductDetails(user, +orderProductId: number,updateOrderProductDto: UpdateOrderStatusDto ) {
  // //   try {
  // //     return `Update order product details: ${orderProductId}`;
  // //   } catch (error) {
  // //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  // //   }
  // // }

  // async findMyOrders(
  //   user,
  //   currentPage = 0,
  //   perPage = 10,
  //   search = null,
  //   status = null,
  // ) {
  //   let filter;
  //   let andFilter;

  //   andFilter = { userId: user.id };

  //   if (status) {
  //     andFilter = {
  //       ...andFilter,
  //       status: status,
  //     };
  //   }

  //   if (search) {
  //     filter = [
  //       {
  //         ...andFilter,
  //         orderNumber: Like('%' + search + '%'),
  //       },
  //     ];
  //   } else {
  //     filter = andFilter;
  //   }

  //   try {
  //     const [orders, total] = await this.orderRepository.findAndCount({
  //       where: filter,
  //       order: { createdAt: 'DESC' },
  //       relations: [
  //         'products',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'timeline',
  //         'offer',
  //       ],
  //       take: perPage,
  //       skip: currentPage * perPage,
  //     });

  //     return {
  //       data: orders,
  //       perPage: perPage,
  //       currentPage: currentPage + 1,
  //       totalPage: Math.ceil(total / perPage),
  //       totalResult: total,
  //     };
  //   } catch (e) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }
  // }

  // async findMyOrderByNumber(orderNumber: string) {
  //   let order;
  //   try {
  //     order = await this.orderRepository.findOne({
  //       // where: { userId: user.id, orderNumber },
  //       where: { orderNumber },
  //       relations: [
  //         'products',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'timeline',
  //         'offer',
  //       ],
  //     });
  //   } catch (e) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }

  //   if (!order) throwError(HttpStatus.NOT_FOUND, [], 'Order not found');
  //   return order;
  // }

  // // async findAll(
  // //   user,
  // //   currentPage = 0,
  // //   perPage = 10,
  // //   userId = null,
  // //   search = null,
  // //   status = null,
  // //   startDate = null,
  // //   endDate = null,
  // // ) {
  // //   let filter;
  // //   let andFilter;

  // //   const start = new Date(startDate);
  // //   // console.log('start', start);
  // //   // start.setHours(start.getHours() - 6);
  // //   const end = new Date(endDate);
  // //   // console.log('end', end);

  // //   const modifiedStartDate = new Date(
  // //     `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
  // //   );

  // //   const modifiedEndDate = new Date(
  // //     `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
  // //   );

  // //   // console.log(modifiedStartDate, modifiedEndDate);

  // //   if (userId) {
  // //     andFilter = { ...andFilter, userId: userId };
  // //   }

  // //   if (status) {
  // //     andFilter = {
  // //       status: status,
  // //     };
  // //   }

  // //   if (startDate && endDate) {
  // //     andFilter = {
  // //       ...andFilter,
  // //       createdAt: Between(modifiedStartDate, modifiedEndDate),
  // //     };
  // //   } else if (!startDate && endDate) {
  // //     andFilter = {
  // //       ...andFilter,
  // //       createdAt: LessThanOrEqual(modifiedEndDate),
  // //     };
  // //   } else if (startDate && !endDate) {
  // //     andFilter = {
  // //       ...andFilter,
  // //       createdAt: MoreThanOrEqual(modifiedStartDate),
  // //     };
  // //   }

  // //   if (search) {
  // //     filter = [
  // //       {
  // //         ...andFilter,
  // //         id: search,
  // //       },
  // //       {
  // //         ...andFilter,
  // //         orderNumber: Like('%' + search + '%'),
  // //       },
  // //       {
  // //         ...andFilter,
  // //         shippingPhone: Like('%' + search + '%'),
  // //       },
  // //       {
  // //         ...andFilter,
  // //         user: {
  // //           phone: Like('%' + search + '%'),
  // //         },
  // //       },
  // //       {
  // //         ...andFilter,
  // //         user: {
  // //           email: Like('%' + search + '%'),
  // //         },
  // //       },
  // //       {
  // //         ...andFilter,
  // //         products: {
  // //           sku: Like('%' + search + '%'),
  // //         },
  // //       },
  // //     ];
  // //   } else {
  // //     filter = andFilter;
  // //   }

  // //   try {
  // //     const [orders, total] = await this.orderRepository.findAndCount({
  // //       where: filter,
  // //       order: { id: 'DESC' },
  // //       relations: ['products', 'products.attributes', 'offer'],
  // //       select: {
  // //         id: true,
  // //         orderNumber: true,
  // //         discount: true,
  // //         subtotal: true,
  // //         deliveryCharge: true,
  // //         grandTotal: true,
  // //         paid: true,
  // //         due: true,
  // //         paymentMethod: true,
  // //         paymentStatus: true,
  // //         shippingArea: true,
  // //         shippingCity: true,
  // //         shippingCountry: true,
  // //         shippingEmail: true,
  // //         shippingLat: true,
  // //         shippingLon: true,
  // //         shippingName: true,
  // //         shippingPhone: true,
  // //         shippingPostalCode: true,
  // //         shippingStreet: true,
  // //         shippingThana: true,
  // //         status: true,
  // //         createdAt: true,
  // //         updatedAt: true,
  // //         products: {
  // //           id: true,
  // //           orderId: true,
  // //           sku: true,
  // //           customSku: true,
  // //           name: true,
  // //           slug: true,
  // //           thumbnail: true,
  // //           price: true,
  // //           discountedPrice: true,
  // //           quantity: true,
  // //           totalPrice: true,
  // //           discount: true,
  // //           status: true,
  // //           attributes: true,
  // //         },
  // //       },
  // //       take: perPage,
  // //       skip: currentPage * perPage,
  // //     });

  // //     return {
  // //       data: orders,
  // //       perPage: perPage,
  // //       currentPage: currentPage + 1,
  // //       totalPage: Math.ceil(total / perPage),
  // //       totalResult: total,
  // //     };
  // //   } catch (e) {
  // //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  // //   }
  // // }

  // // update order product
  // async updateOrderProduct(
  //   user,
  //   orderProductId: number,
  //   updateOrderProductQtyDto: UpdateOrderProductQtyDto,
  // ) {
  //   try {
  //     // check order product exist or not
  //     const orderProduct = await this.orderProductRepository.findOne({
  //       where: { id: orderProductId },
  //     });
  //     if (!orderProduct) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Invalid order product id.');
  //     }

  //     const order = await this.orderRepository.findOne({
  //       where: { id: orderProduct.orderId },
  //     });
  //     if (!order) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Invalid order id.');
  //     }

  //     const productPrice = orderProduct.price;

  //     const updateQty = updateOrderProductQtyDto.qty - orderProduct.quantity;

  //     let updateTotalPrice;
  //     if (updateOrderProductQtyDto.totalAmount) {
  //       updateTotalPrice = updateOrderProductQtyDto.totalAmount;
  //     } else {
  //       updateTotalPrice = productPrice * updateQty;
  //     }

  //     //update order product
  //     await this.orderProductRepository.update(orderProductId, {
  //       quantity: updateOrderProductQtyDto.qty,
  //       totalPrice: updateTotalPrice,
  //     });

  //     // update order
  //     const updateOrder = await this.orderRepository.update(
  //       orderProduct.orderId,
  //       {
  //         subtotal: () => `subtotal + ${updateTotalPrice}`,
  //         grandTotal: () => `grand_total + ${updateTotalPrice}`,
  //         due: () => `due + ${updateTotalPrice}`,
  //       },
  //     );

  //     if (updateOrder.affected === 0) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Order not updated.');
  //     }

  //     // send successfull
  //     return {
  //       status: HttpStatus.OK,
  //       message: 'Order product updated successfully',
  //     };
  //   } catch (error) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  //   }
  // }

  // // add order product
  // async addOrderProduct(
  //   user,
  //   orderId: number,
  //   orderProducts: AddOrderProductDto[],
  // ) {
  //   try {
  //     // check order exits or not
  //     const order = await this.orderRepository.findOne({
  //       where: { id: orderId },
  //       relations: ['products'],
  //     });

  //     if (!order) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Invalid order id.');
  //     }

  //     // Get and Check order skus
  //     if (orderProducts.length === 0)
  //       throwError(400, [], 'Invalid products');
  //     let products;
  //     try {
  //       products = await this.skuRepository.find({
  //         where: {
  //           id: In(orderProducts.map((product) => product.skuId)),
  //         },
  //         relations: [
  //           'product',
  //           'attributes',
  //           'product.category',
  //           'product.brand',
  //         ],
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  //     }

  //     if (products.length !== orderProducts.length) {
  //       throwError(400, [], 'Invalid products');
  //     }

  //     let skus = [];
  //     let preOrderAmount;

  //     // return products;
  //     skus = products.map(async (sku) => {
  //       // Check quantity is valid
  //       // console.log('skus', sku);
  //       const quantity = orderProducts.find(
  //         (item) => item.skuId == sku.id,
  //       ).quantity;

  //       if (quantity > sku.quantity) throwError(400, [], 'Invalid quantity');

  //       preOrderAmount = sku?.preOrderPer ? sku?.preOrderPer : null;

  //       // Check product is active or not
  //       if (sku.product.status !== ProductStatus.ACTIVE)
  //         throwError(400, [], 'Product is not active');

  //       const matchProduct = orderProducts.find(
  //         (item) => item.skuId === sku.id,
  //       );

  //       // let customeSizePrice: number = 0;
  //       const customeSizePrice: { name: string; size: number; price: number }[] =
  //         [];
  //       // check if measure exits or not
  //       if (matchProduct?.custom_sizes) {
  //         // // get category measurement
  //         const category = await this.categoryService.getCategoryMeasurements(
  //           sku.product.categoryId,
  //         );
  //         // loop through all custom sizes
  //         for (const customSizeWithKey of matchProduct?.custom_sizes) {
  //           // category measurement pricing parse
  //           const measurementPricing = JSON.parse(category.measurementPricing);
  //           // check if measurement exits or not
  //           const mainMeasurement = measurementPricing.find((measure) => {
  //             return measure?.name === customSizeWithKey?.key;
  //           });
  //           if (mainMeasurement) {
  //             const measurement = this.getCustomePrice(
  //               +customSizeWithKey.value,
  //               mainMeasurement?.values,
  //             );
  //             customeSizePrice.push({
  //               name: customSizeWithKey.key,
  //               size: Number(customSizeWithKey.value),
  //               price: Number(measurement),
  //             });
  //           } else {
  //             customeSizePrice.push({
  //               name: customSizeWithKey.key,
  //               size: Number(customSizeWithKey.value),
  //               price: 0,
  //             });
  //           }
  //         }
  //       }

  //       // custome size amount
  //       let customeSizePriceAmount = customeSizePrice.reduce(
  //         (total, size) => total + size.price,
  //         0,
  //       );

  //       // if discount valid then calculate total price with discount
  //       const calcTotalPrice = checkDiscountValidation(
  //         true,
  //         sku.discountedPrice,
  //         sku.discountedPriceStart,
  //         sku.discountedPriceEnd,
  //       )
  //         ? sku.discountedPrice * quantity +
  //         customeSizePriceAmount * quantity +
  //         ((sku.vat * sku.discountedPrice) / 100) * quantity
  //         : sku.price * quantity +
  //         customeSizePriceAmount * quantity +
  //         ((sku.vat * sku.price) / 100) * quantity;

  //       return {
  //         productId: sku.product.id,
  //         orderId: orderId,
  //         skuId: sku.id,
  //         sku: sku.sku,
  //         customSku: sku.customSku,
  //         name: sku.product.name,
  //         slug: sku.product.slug,
  //         purchasePrice: sku.purchasePrice,
  //         price: sku.price,
  //         discountedPrice: checkDiscountValidation(
  //           true,
  //           sku.discountedPrice,
  //           sku.discountedPriceStart,
  //           sku.discountedPriceEnd,
  //         )
  //           ? sku.discountedPrice
  //           : 0,
  //         quantity: quantity,
  //         vat: sku.vat,
  //         insideDhaka: sku.product.insideDhaka,
  //         outsideDhaka: sku.product.outsideDhaka,
  //         warrantyType: sku.product.warrantyType,
  //         warranty: sku.product.warranty,
  //         custom_sizes: JSON.stringify(customeSizePrice),
  //         customeSize: JSON.stringify(customeSizePrice),
  //         // measurementSize: matchProduct?.measurementSize,
  //         // add vat to total price
  //         // totalPrice:
  //         //   sku.discountedPrice * quantity +
  //         //   ((sku.vat * sku.discountedPrice) / 100) * quantity,
  //         totalPrice: calcTotalPrice,
  //         ...(sku.product.brand && { brand: sku.product.brand.name }),
  //         categoryId: sku.product?.category?.id,
  //         brandId: sku.product?.brand?.id,
  //         thumbnail: sku.product.thumbnail,
  //         attributes:
  //           sku?.attributes?.map((item) => ({
  //             key: item.key,
  //             value: item.value,
  //           })) || [],
  //         // attributes:
  //         //   matchProduct?.attributes?.map((item) => ({
  //         //     key: item.key,
  //         //     value: item.value,
  //         //   })) || [],
  //         discount: checkDiscountValidation(
  //           true,
  //           sku.discountedPrice,
  //           sku.discountedPriceStart,
  //           sku.discountedPriceEnd,
  //         ),
  //         status: 'Order Placed',
  //       };
  //     });

  //     skus = await Promise.all(skus);

  //     // subtotal calculation
  //     const subtotal = skus.reduce((acc, item) => acc + item.totalPrice, 0);

  //     // insert order product and update orders table
  //     let insertData;
  //     let orderProductData;
  //     await this.dataSource.transaction(async (manager) => {
  //       // insert order products
  //       orderProductData = await manager
  //         .getRepository('order_product')
  //         .save(skus);

  //       // update order
  //       insertData = await manager.getRepository('order').update(orderId, {
  //         subtotal: () => `subtotal + ${subtotal}`,
  //         grandTotal: () => `grand_total + ${subtotal}`,
  //         due: () => `due + ${subtotal}`,
  //       });
  //     });

  //     if (insertData.affected === 0) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Order not updated.');
  //     }

  //     const orderNewData = await this.orderRepository.findOne({
  //       where: { id: orderId },
  //       relations: ['products'],
  //     });

  //     // insert order log
  //     const logType = 'Order Product Add';
  //     const logMessage = `Order product added successfully`;
  //     await this.saveOrderLog(
  //       user,
  //       order,
  //       logType,
  //       logMessage,
  //       order,
  //       orderNewData,
  //     );

  //     // send successfull
  //     return {
  //       status: HttpStatus.OK,
  //       message: 'Order product added successfully',
  //     };
  //   } catch (error) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  //   }
  // }

  // // delete order product
  // async deleteOrderProduct(user, orderProductId: number) {
  //   try {
  //     // find order product is exits or not
  //     const orderProduct = await this.orderProductRepository.findOne({
  //       where: { id: orderProductId },
  //     });
  //     if (!orderProduct) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Invalid order product id.');
  //     }

  //     // find order exits or not
  //     const order = await this.orderRepository.findOne({
  //       where: { id: orderProduct.orderId },
  //     });
  //     if (!order) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Invalid order id.');
  //     }

  //     // delete order product
  //     let updateOrder;
  //     await this.dataSource.transaction(async (manager) => {
  //       // delete order product
  //       await manager.getRepository('order_product').delete(orderProductId);

  //       // update order
  //       updateOrder = await manager
  //         .getRepository('order')
  //         .update(orderProduct.orderId, {
  //           subtotal: () => `subtotal - ${orderProduct.totalPrice}`,
  //           grandTotal: () => `grand_total - ${orderProduct.totalPrice}`,
  //           due: () => `due - ${orderProduct.totalPrice}`,
  //         });
  //     });

  //     if (updateOrder.affected === 0) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Order not updated.');
  //     }

  //     return {
  //       status: HttpStatus.OK,
  //       message: 'Order product deleted successfully',
  //     };
  //   } catch (error) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  //   }
  // }

  // // update delivery charge
  // async updateDeliveryCharge(
  //   user,
  //   orderId: number,
  //   updateDeliveryChargeDto: UpdateDeliveryChargesDto,
  // ) {
  //   try {
  //     // find order exits or not
  //     const order = await this.orderRepository.findOne({
  //       where: { id: orderId },
  //     });
  //     if (!order) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Invalid order id.');
  //     }

  //     // update delivery charge amount
  //     const deliveryChargeAmount =
  //       updateDeliveryChargeDto.deliveryCharge - order.deliveryCharge;

  //     // update order
  //     const updateOrder = await this.orderRepository.update(orderId, {
  //       deliveryCharge: updateDeliveryChargeDto.deliveryCharge,
  //       subtotal: () => `subtotal + ${deliveryChargeAmount}`,
  //       grandTotal: () => `grand_total + ${deliveryChargeAmount}`,
  //       due: () => `due + ${deliveryChargeAmount}`,
  //     });

  //     // check order updated or not
  //     if (updateOrder.affected === 0) {
  //       throwError(HttpStatus.BAD_REQUEST, [], 'Order not updated.');
  //     }
  //     return await this.orderRepository.findOne({
  //       where: { id: orderId },
  //     });
  //   } catch (error) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  //   }
  // }

  // async findAll(
  //   user,
  //   currentPage = 0,
  //   perPage = 10,
  //   userId = null,
  //   search = null,
  //   status = null,
  //   startDate = null,
  //   endDate = null,
  // ) {
  //   let filter;
  //   let andFilter;

  //   const start = new Date(startDate);
  //   // console.log('start', start);
  //   // start.setHours(start.getHours() - 6);
  //   const end = new Date(endDate);
  //   // console.log('end', end);

  //   const modifiedStartDate = `${start.getFullYear()}-${start.getMonth() + 1
  //     }-${start.getDate()}`;

  //   const modifiedEndDate = `${end.getFullYear()}-${end.getMonth() + 1
  //     }-${end.getDate()}`;

  //   // console.log(modifiedStartDate, modifiedEndDate);

  //   let whereCondition = `order.deletedAt IS NULL`;

  //   if (userId) {
  //     whereCondition += ` AND order.userId = ${userId}`;
  //   }

  //   if (status) {
  //     whereCondition += ` AND order.status = '${status}'`;
  //   }

  //   if (startDate && endDate) {
  //     whereCondition += ` AND Date(order.createdAt) BETWEEN '${modifiedStartDate}' AND '${modifiedEndDate}'`;
  //   } else if (!startDate && endDate) {
  //     whereCondition += ` AND Date(order.createdAt) <= '${modifiedEndDate}'`;
  //   } else if (startDate && !endDate) {
  //     whereCondition += ` AND Date(order.createdAt) >= '${modifiedStartDate}'`;
  //   }

  //   if (search) {
  //     whereCondition += ` AND (order.id LIKE '%${search}%' OR order.orderNumber LIKE '%${search}%' OR order.shippingPhone LIKE '%${search}%' OR payments.transaction_id LIKE '%${search}%')`;
  //   }

  //   try {
  //     const [orders, total] = await this.orderRepository
  //       .createQueryBuilder('order')
  //       .leftJoin('order.products', 'products')
  //       .leftJoin('products.attributes', 'attributes')
  //       .leftJoin('order.payments', 'payments')
  //       .leftJoin('offer', 'offer')
  //       .where(whereCondition)
  //       .orderBy('order.id', 'DESC')
  //       .select([
  //         'order.id',
  //         'order.orderNumber',
  //         'order.discount',
  //         'order.subtotal',
  //         'order.deliveryCharge',
  //         'order.grandTotal',
  //         'order.paid',
  //         'order.due',
  //         'order.orderPlacedById',
  //         'order.orderPlacedByType',
  //         'order.paymentMethod',
  //         'order.paymentStatus',
  //         'order.shippingArea',
  //         'order.shippingCity',
  //         'order.shippingCountry',
  //         'order.shippingEmail',
  //         'order.shippingLat',
  //         'order.shippingLon',
  //         'order.shippingName',
  //         'order.shippingPhone',
  //         'order.shippingPostalCode',
  //         'order.shippingStreet',
  //         'order.shippingThana',
  //         'order.status',
  //         'order.createdAt',
  //         'order.updatedAt',
  //         'products.id',
  //         'products.orderId',
  //         'products.sku',
  //         'products.customSku',
  //         'products.name',
  //         'products.slug',
  //         'products.thumbnail',
  //         'products.price',
  //         'products.discountedPrice',
  //         'products.quantity',
  //         'products.totalPrice',
  //         'products.discount',
  //         'products.status',
  //         'attributes.id',
  //         'attributes.orderProductId',
  //         'attributes.key',
  //         'attributes.value',
  //         'payments.id',
  //         'payments.orderId',
  //         'payments.transactionId',
  //         'payments.amount',
  //         'payments.status',
  //         'offer.id',
  //         'offer.name',
  //         'offer.status',
  //       ])
  //       .take(perPage)
  //       .skip(currentPage * perPage)
  //       .getManyAndCount();

  //     return {
  //       data: orders,
  //       perPage: perPage,
  //       currentPage: currentPage + 1,
  //       totalPage: Math.ceil(total / perPage),
  //       totalResult: total,
  //     };
  //   } catch (e) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }
  // }

  // async findOne(user, id: number) {
  //   let order;
  //   try {
  //     order = await this.orderRepository.findOne({
  //       where: { id },
  //       relations: [
  //         'products',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'products.warehouse',
  //         'user',
  //         'timeline',
  //         'payments',
  //         'offer',
  //       ],
  //       select: {
  //         user: {
  //           id: true,
  //           avatar: true,
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //           phone: true,
  //           status: true,
  //         },
  //       },
  //     });
  //   } catch (e) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }

  //   if (!order) throwError(HttpStatus.NOT_FOUND, [], 'Order not found');
  //   if (order.orderPlacedByType === ORDER_PLACED_BY_TYPE.ADMIN && order.orderPlacedById) {
  //     try {
  //       const admin = await this.userRepository.findOne({
  //         where: { id: order.orderPlacedById },
  //         select: [
  //           "id",
  //           "type",
  //           "avatar",
  //           "firstName",
  //           "lastName",
  //           "email",
  //           "phone",
  //         ]
  //       });
  //       order.admin = admin;
  //     } catch (e) {
  //       throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //     }
  //   }
  //   return order;
  // }

  // /**
  //  * Update order product status
  //  *
  //  * Change order product status and update main order status accordingly
  //  *
  //  * @param user object - logged in user
  //  * @param id number - Order Product id
  //  * @param updateOrderStatus object - Order Product status
  //  *
  //  * @return object - Updated order product
  //  *
  //  * @author Mehedi Hassan Durjoi <https://github.com/durjoi>
  //  * @date 2023-03-15 15:41:00
  //  */
  // async updateStatus(
  //   user,
  //   id: number,
  //   updateOrderStatus: UpdateOrderStatusDto,
  // ) {
  //   // get the order product
  //   const orderProduct = await this.orderProductRepository.findOne({
  //     where: { id: id },
  //   });

  //   if (!orderProduct) {
  //     throwError(HttpStatus.BAD_REQUEST, [], 'Invalid order product id.');
  //   }

  //   // const queryRunner = this.dataSource.createQueryRunner();
  //   // await queryRunner.connect();
  //   // await queryRunner.startTransaction();

  //   const updatedOrderProduct = await this.orderProductRepository.findOne({
  //     where: { id: id },
  //   });

  //   try {
  //     await this.dataSource.transaction(async (manager) => {
  //       const orderProductOld = await this.orderProductRepository.findOne({
  //         where: { id: id },
  //       });

  //       await manager
  //         .getRepository('order_product')
  //         .update(id, { status: updateOrderStatus.status });

  //       // Notification for admin
  //       await manager.getRepository('notification').save({
  //         userType: UserType.ADMIN,
  //         content: `Order product status has been changed from ${orderProductOld.status} to ${updatedOrderProduct.status}`,
  //         type: 'order',
  //         param: orderProductOld.orderId,
  //       });

  //       // Change Order Status if needed
  //       const orderAllProducts = await this.orderProductRepository.find({
  //         where: { orderId: updatedOrderProduct.orderId },
  //       });

  //       let allProductsStatusUnique = [
  //         ...new Set(orderAllProducts.map((item) => item.status)),
  //       ];

  //       // check canceled order available or not
  //       if (
  //         allProductsStatusUnique.includes('Canceled') &&
  //         allProductsStatusUnique.length > 1
  //       ) {
  //         allProductsStatusUnique = allProductsStatusUnique.filter((item) => {
  //           return item !== 'Canceled';
  //         });
  //       }

  //       const originalStatus = OrderStatuses.filter((item) => {
  //         return allProductsStatusUnique.includes(item.name);
  //       });

  //       const minStatus = originalStatus.reduce(
  //         (prep, current) => (prep.id < current.id ? prep : current),
  //         originalStatus[0],
  //       );

  //       console.log('hit');
  //       console.log(minStatus);

  //       const orderOld = await this.orderRepository.findOne({
  //         where: { id: updatedOrderProduct.orderId },
  //       });

  //       // Calculating order new price if needed
  //       const orderUpdateData = {};
  //       if (
  //         ['Canceled'].includes(updatedOrderProduct.status) &&
  //         !['Canceled'].includes(orderProductOld.status)
  //       ) {
  //         orderUpdateData['subtotal'] =
  //           orderOld.subtotal - updatedOrderProduct.totalPrice;
  //         orderUpdateData['grandTotal'] =
  //           orderOld.grandTotal - updatedOrderProduct.totalPrice;

  //         orderUpdateData['due'] =
  //           orderOld.due - updatedOrderProduct.totalPrice;
  //       } else if (
  //         ['Canceled'].includes(orderProductOld.status) &&
  //         !['Canceled'].includes(updatedOrderProduct.status)
  //       ) {
  //         orderUpdateData['subtotal'] =
  //           orderOld.subtotal + updatedOrderProduct.totalPrice;
  //         orderUpdateData['grandTotal'] =
  //           orderOld.grandTotal + updatedOrderProduct.totalPrice;

  //         orderUpdateData['due'] =
  //           orderOld.due + updatedOrderProduct.totalPrice;
  //       }

  //       if (orderOld.status !== minStatus?.name) {
  //         // Update delivery charge if all the products of a shop are canceled
  //         if (
  //           minStatus?.name === 'Canceled' &&
  //           orderOld.status !== 'Canceled'
  //         ) {
  //           orderUpdateData['deliveryCharge'] =
  //             orderOld.deliveryCharge - orderOld.deliveryCharge;
  //           orderUpdateData['grandTotal'] =
  //             orderOld.grandTotal -
  //             updatedOrderProduct.totalPrice -
  //             orderOld.deliveryCharge;
  //           orderUpdateData['due'] =
  //             orderOld.due -
  //             updatedOrderProduct.totalPrice -
  //             orderOld.deliveryCharge;
  //         } else if (
  //           orderProductOld.status === 'Canceled' &&
  //           minStatus?.name !== 'Canceled'
  //         ) {
  //           orderUpdateData['deliveryCharge'] =
  //             orderOld.deliveryCharge + orderOld.deliveryCharge;
  //           orderUpdateData['due'] =
  //             orderOld.due +
  //             updatedOrderProduct.totalPrice +
  //             orderOld.deliveryCharge;
  //         }

  //         orderUpdateData['status'] = minStatus?.name;
  //       }

  //       await manager
  //         .getRepository('order')
  //         .update(updatedOrderProduct.orderId, { ...orderUpdateData });

  //       // Update order status timeline
  //       if (orderOld.status !== minStatus?.name) {
  //         await manager.getRepository('order_timeline').save({
  //           orderId: updatedOrderProduct.orderId,
  //           status: minStatus?.name,
  //         });

  //         // Send notification to customer
  //         await manager.getRepository('notification').save({
  //           userId: orderOld.userId,
  //           userType: UserType.CUSTOMER,
  //           content: `Your order status has been changed to ${minStatus?.name}`,
  //           type: 'order',
  //           param: orderOld.orderNumber,
  //         });

  //         // Insert In system notification for admin
  //         await manager.getRepository('notification').save({
  //           userType: UserType.ADMIN,
  //           content: `Order status has been changed to ${minStatus?.name} for order number ${orderOld.orderNumber}`,
  //           type: 'order',
  //           param: orderOld.id,
  //         });
  //       }
  //     });

  //     return await this.orderRepository.findOne({
  //       where: { id: updatedOrderProduct.orderId },
  //       relations: [
  //         'products',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'user',
  //         'timeline',
  //         'offer',
  //       ],
  //       select: {
  //         user: {
  //           id: true,
  //           avatar: true,
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //           phone: true,
  //           status: true,
  //         },
  //       },
  //     });
  //   } catch (e) {
  //     console.log(e.message);
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], 'Can not update status');
  //   }
  // }

  // async updateShippingAddress(
  //   user,
  //   id,
  //   shippingAddressUpdateDto: ShippingAddressUpdateDto,
  // ) {
  //   let order;
  //   try {
  //     order = await this.orderRepository.findOne({
  //       where: { id: id },
  //       relations: [
  //         'products',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'timeline',
  //         'offer',
  //         'user',
  //       ],
  //       select: {
  //         user: {
  //           id: true,
  //           avatar: true,
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //           phone: true,
  //           status: true,
  //         },
  //       },
  //     });
  //   } catch (e) {
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }

  //   if (!order) {
  //     throwError(HttpStatus.BAD_REQUEST, [], 'Invalid order !');
  //   }

  //   // const queryRunner = this.dataSource.createQueryRunner();
  //   // await queryRunner.connect();
  //   // await queryRunner.startTransaction();

  //   try {
  //     // Prepare shipping data
  //     const shipping = {
  //       shippingName: shippingAddressUpdateDto.shippingName,
  //       shippingPhone: shippingAddressUpdateDto.shippingPhone,
  //       ...(shippingAddressUpdateDto.shippingEmail && {
  //         shippingEmail: shippingAddressUpdateDto.shippingEmail,
  //       }),
  //       shippingCountry: shippingAddressUpdateDto.shippingCountry,
  //       shippingCity: shippingAddressUpdateDto.shippingCity,
  //       ...(shippingAddressUpdateDto.shippingThana && {
  //         shippingThana: shippingAddressUpdateDto.shippingThana,
  //       }),
  //       ...(shippingAddressUpdateDto.shippingArea && {
  //         shippingArea: shippingAddressUpdateDto.shippingArea,
  //       }),
  //       shippingStreet: shippingAddressUpdateDto.shippingStreet,
  //       ...(shippingAddressUpdateDto.shippingPostalCode && {
  //         shippingPostalCode: shippingAddressUpdateDto.shippingPostalCode,
  //       }),
  //       ...(shippingAddressUpdateDto.shippingLat && {
  //         shippingLat: shippingAddressUpdateDto.shippingLat,
  //       }),
  //       ...(shippingAddressUpdateDto.shippingLon && {
  //         shippingLon: shippingAddressUpdateDto.shippingLon,
  //       }),
  //     };

  //     await this.orderRepository.update({ id: order.id }, { ...shipping });

  //     // await queryRunner.commitTransaction();
  //     // await queryRunner.release();

  //     // get updated order
  //     const updatedOrder = await this.orderRepository.findOne({
  //       where: { id: order.id },
  //       relations: [
  //         'products',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'timeline',
  //         'offer',
  //         'user',
  //       ],
  //       select: {
  //         user: {
  //           id: true,
  //           avatar: true,
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //           phone: true,
  //           status: true,
  //         },
  //       },
  //     });

  //     // insert order log
  //     await this.saveOrderLog(
  //       user,
  //       order,
  //       'Shipping Address Update',
  //       'Shipping Address Update',
  //       order,
  //       updatedOrder,
  //     );
  //     // await queryRunner.manager.getRepository('order_log').save({
  //     //   userId: user.id,
  //     //   orderId: order.id,
  //     //   type: 'Shipping Address Update',
  //     //   message: 'Shipping Address Update',
  //     //   oldData: JSON.stringify(order),
  //     //   newData: JSON.stringify(updatedOrder),
  //     // });

  //     return updatedOrder;
  //   } catch (e) {
  //     console.log(e);
  //     // await queryRunner.rollbackTransaction();
  //     // await queryRunner.release();
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   } finally {
  //     // await queryRunner.release();
  //   }
  // }

  // async updateMainOrderStatus(
  //   user,
  //   id: number,
  //   updateOrderStatus: UpdateOrderStatusDto,
  // ) {
  //   // Find the order by id
  //   const order = await this.orderRepository.findOne({
  //     where: { id: id },
  //     relations: [
  //       'products',
  //       'products.category',
  //       'products.brand',
  //       'products.attributes',
  //       'user',
  //       'timeline',
  //       'offer',
  //     ],
  //     select: {
  //       user: {
  //         id: true,
  //         avatar: true,
  //         firstName: true,
  //         lastName: true,
  //         email: true,
  //         phone: true,
  //         status: true,
  //       },
  //     },
  //   });

  //   // Check if order is not found
  //   if (!order) {
  //     throwError(HttpStatus.NOT_FOUND, [], 'Order not found');
  //   }

  //   // Check if order status is not changed
  //   if (order.status === updateOrderStatus.status) {
  //     throwError(
  //       HttpStatus.BAD_REQUEST,
  //       [],
  //       'Order status is not changed. Please try again',
  //     );
  //   }

  //   // const queryRunner = this.dataSource.createQueryRunner();
  //   // await queryRunner.connect();
  //   // await queryRunner.startTransaction();
  //   try {
  //     await this.dataSource.transaction(async (manager) => {
  //       // Change order status
  //       await manager
  //         .getRepository('order')
  //         .update(id, { status: updateOrderStatus.status });

  //       // Add status change to timeline
  //       await manager.getRepository('order_timeline').save({
  //         orderId: order.id,
  //         status: updateOrderStatus,
  //       });
  //       // Send notification to customer
  //       await manager.getRepository('notification').save({
  //         userId: order.userId,
  //         userType: UserType.CUSTOMER,
  //         content: `Your order status has been changed to ${updateOrderStatus.status}`,
  //         type: 'order',
  //         param: order.orderNumber,
  //       });

  //       // Insert In system notification for admin
  //       await manager.getRepository('notification').save({
  //         userType: UserType.ADMIN,
  //         content: `Order status has been changed to ${updateOrderStatus.status} for order number ${order.orderNumber}`,
  //         type: 'order',
  //         param: order.id,
  //       });
  //     });
  //     // await queryRunner.commitTransaction();
  //     // await queryRunner.release();

  //     // order new data
  //     const orderNewData = await this.orderRepository.findOne({
  //       where: { id: order.id },
  //       relations: [
  //         'products',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'user',
  //         'timeline',
  //         'offer',
  //       ],
  //       select: {
  //         user: {
  //           id: true,
  //           avatar: true,
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //           phone: true,
  //           status: true,
  //         },
  //       },
  //     });

  //     // insert order log
  //     const logType = 'Order Status Change by admin';
  //     const logMessage = `Order status has been changed from ${order.status} to ${orderNewData.status}`;
  //     await this.saveOrderLog(
  //       user,
  //       order,
  //       logType,
  //       logMessage,
  //       order,
  //       orderNewData,
  //     );

  //     return orderNewData;
  //   } catch (e) {
  //     console.log(e.message);
  //     // await queryRunner.rollbackTransaction();
  //     // await queryRunner.release();
  //     throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // async updateOrderPaymentStatus(
  //   user,
  //   id: number,
  //   updateOrderStatus: UpdatePaymentStatusDto,
  // ) {
  //   // Find the order by id
  //   const order = await this.orderRepository.findOne({
  //     where: { id: id },
  //     relations: [
  //       'products',
  //       'products.category',
  //       'products.brand',
  //       'products.attributes',
  //       'user',
  //       'timeline',
  //       'offer',
  //     ],
  //     select: {
  //       user: {
  //         id: true,
  //         avatar: true,
  //         firstName: true,
  //         lastName: true,
  //         email: true,
  //         phone: true,
  //         status: true,
  //       },
  //     },
  //   });

  //   // Check if order is not found
  //   if (!order) {
  //     throwError(HttpStatus.NOT_FOUND, [], 'Order not found');
  //   }

  //   try {
  //     await this.dataSource.transaction(async (manager) => {
  //       // Change order status
  //       await manager.getRepository('order').update(id, {
  //         paymentStatus: updateOrderStatus.status,
  //       });

  //       // Add status change to timeline
  //       await manager.getRepository('order_timeline').save({
  //         orderId: order.id,
  //         status: updateOrderStatus,
  //       });
  //     });

  //     // order new data
  //     const orderNewData = await this.orderRepository.findOne({
  //       where: { id: order.id },
  //       relations: [
  //         'products',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'user',
  //         'timeline',
  //         'offer',
  //       ],
  //       select: {
  //         user: {
  //           id: true,
  //           avatar: true,
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //           phone: true,
  //           status: true,
  //         },
  //       },
  //     });

  //     // insert order log
  //     const logType = 'payment Status Change by admin';
  //     const logMessage = `payment status has been changed from ${order.paymentStatus} to ${orderNewData.paymentStatus}`;
  //     await this.saveOrderLog(
  //       user,
  //       order,
  //       logType,
  //       logMessage,
  //       order,
  //       orderNewData,
  //     );

  //     return orderNewData;
  //   } catch (e) {
  //     console.log(e);
  //     throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   } finally {
  //     // await queryRunner.release();
  //   }
  // }

  // async updateMainOrderStatusByThirdparty(
  //   orderNumber: string,
  //   updateOrderStatus: UpdateOrderStatusDto,
  // ): Promise<Order | undefined> {
  //   // Find the order by id
  //   const order = await this.orderRepository.findOne({
  //     where: { orderNumber: orderNumber },
  //   });

  //   // Check if order is not found
  //   if (!order) {
  //     throwError(HttpStatus.NOT_FOUND, [], 'Order not found');
  //   }

  //   // Check if order status is not changed
  //   if (order.status === updateOrderStatus.status) {
  //     throwError(
  //       HttpStatus.BAD_REQUEST,
  //       [],
  //       'Order status is not changed. Please try again',
  //     );
  //   }

  //   // Start a transaction
  //   await this.dataSource.transaction(async (transactionalEntityManager) => {
  //     try {
  //       // // Change order status
  //       await transactionalEntityManager.update(Order, order.id, {
  //         status: updateOrderStatus.status,
  //       });

  //       // Add status change to timeline
  //       await transactionalEntityManager.save(OrderTimeline, {
  //         orderId: order.id,
  //         status: updateOrderStatus.status,
  //       });

  //       await transactionalEntityManager.save(Notification, {
  //         userId: order.userId,
  //         userType: UserType.CUSTOMER,
  //         content: `Your order status has been changed to ${updateOrderStatus.status}`,
  //         type: 'order',
  //         param: order.orderNumber,
  //       });

  //       // Insert system notification for admin
  //       await transactionalEntityManager.save(Notification, {
  //         userType: UserType.ADMIN,
  //         content: `Order status has been changed to ${updateOrderStatus.status} for order number ${order.orderNumber}`,
  //         type: 'order',
  //         param: order.id.toString(),
  //       });
  //     } catch (error) {
  //       console.error('Error during transaction:', error.message);
  //       throw new HttpException(
  //         'cannot update order status',
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   });

  //   // Fetch the updated order with relations
  //   return await this.orderRepository.findOne({
  //     where: { id: order.id },
  //     relations: [
  //       'products',
  //       'products.category',
  //       'products.brand',
  //       'products.attributes',
  //       'user',
  //       'timeline',
  //       'offer',
  //     ],
  //     select: {
  //       user: {
  //         id: true,
  //         avatar: true,
  //         firstName: true,
  //         lastName: true,
  //         email: true,
  //         phone: true,
  //         status: true,
  //       },
  //     },
  //   });
  // }

  // // async updateMainOrderStatusByThirdparty(
  // //   orderNumber: string,
  // //   updateOrderStatus: UpdateOrderStatusDto,
  // // ) {
  // //   // Find the order by id
  // //   const order = await this.orderRepository.findOne({
  // //     where: { orderNumber: orderNumber },
  // //   });

  // //   // Check if order is not found
  // //   if (!order) {
  // //     throwError(HttpStatus.NOT_FOUND, [], 'Order not found');
  // //   }

  // //   // Check if order status is not changed
  // //   if (order.status === updateOrderStatus.status) {
  // //     throwError(
  // //       HttpStatus.BAD_REQUEST,
  // //       [],
  // //       'Order status is not changed. Please try again',
  // //     );
  // //   }

  // //   const queryRunner = this.dataSource.createQueryRunner();
  // //   await queryRunner.connect();
  // //   await queryRunner.startTransaction();
  // //   try {
  // //     // Change order status
  // //     await queryRunner.manager
  // //       .getRepository('order')
  // //       .update({ id: order.id }, { status: updateOrderStatus.status });

  // //     // Add status change to timeline
  // //     await queryRunner.manager.getRepository('order_timeline').save({
  // //       orderId: order.id,
  // //       status: updateOrderStatus,
  // //     });
  // //     // Send notification to customer
  // //     await queryRunner.manager.getRepository('notification').save({
  // //       userId: order.userId,
  // //       userType: UserType.CUSTOMER,
  // //       content: `Your order status has been changed to ${updateOrderStatus.status}`,
  // //       type: 'order',
  // //       param: order.orderNumber,
  // //     });

  // //     // Insert In system notification for admin
  // //     await queryRunner.manager.getRepository('notification').save({
  // //       userType: UserType.ADMIN,
  // //       content: `Order status has been changed to ${updateOrderStatus.status} for order number ${order.orderNumber}`,
  // //       type: 'order',
  // //       param: order.id,
  // //     });
  // //     await queryRunner.commitTransaction();
  // //     // await queryRunner.release();

  // //     return await this.orderRepository.findOne({
  // //       where: { id: order.id },
  // //       relations: [
  // //         'products',
  // //         'products.category',
  // //         'products.brand',
  // //         'products.attributes',
  // //         'user',
  // //         'timeline',
  // //         'offer',
  // //       ],
  // //       select: {
  // //         user: {
  // //           id: true,
  // //           avatar: true,
  // //           firstName: true,
  // //           lastName: true,
  // //           email: true,
  // //           phone: true,
  // //           status: true,
  // //         },
  // //       },
  // //     });
  // //   } catch (e) {
  // //     console.log(e);
  // //     await queryRunner.rollbackTransaction();
  // //     await queryRunner.release();
  // //     throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
  // //   } finally {
  // //     await queryRunner.release();
  // //   }
  // // }

  // async trackMyOrder(trackMyOrder: TrackMyOrderDto) {
  //   try {
  //     const order = await this.orderRepository.findOne({
  //       where: {
  //         orderNumber: trackMyOrder.orderNumber,
  //         user: {
  //           phone: trackMyOrder.phone,
  //         },
  //       },
  //       select: {
  //         id: true,
  //         orderNumber: true,
  //         status: true,
  //         discount: true,
  //         subtotal: true,
  //         deliveryCharge: true,
  //         grandTotal: true,
  //       },
  //       relations: [
  //         // 'user',
  //         'products',
  //         'offer',
  //         'products.category',
  //         'products.brand',
  //         'products.attributes',
  //         'timeline',
  //       ],
  //     });

  //     if (!order) throwError(HttpStatus.NOT_FOUND, [], 'Order not found');

  //     return order;
  //   } catch (e) {
  //     console.log(e);
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }
  // }

  // // save order log
  // async saveOrderLog(user = null, order, type, message, oldData, newData) {
  //   try {
  //     await this.orderLogRepository.save({
  //       userId: user?.id,
  //       orderId: order.id,
  //       type: type,
  //       message: message,
  //       oldData: JSON.stringify(oldData),
  //       newData: JSON.stringify(newData),
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], e.message);
  //   }
  // }

  // async findLog(
  //   user,
  //   perPage = 10,
  //   currentPage = 0,
  //   orderId = null,
  //   userId = null,
  //   status = null,
  // ) {
  //   let whereRawCondition = 'order_log.deleted_at IS NULL';

  //   // if productId query exits
  //   if (orderId) {
  //     whereRawCondition += ` AND order_log.order_id = '${orderId}'`;
  //   }

  //   // if userId query exits
  //   if (userId) {
  //     whereRawCondition += ` AND order_log.user_id = '${userId}'`;
  //   }

  //   // if status query exits
  //   if (status) {
  //     whereRawCondition += ` AND order_log.status = '${status}'`;
  //   }

  //   const [logs, total] = await this.orderLogRepository
  //     .createQueryBuilder('order_log')
  //     .leftJoinAndSelect('order_log.user', 'user') // Adjust this line based on your relation
  //     .where(whereRawCondition)
  //     .orderBy('order_log.createdAt', 'DESC')
  //     .select([
  //       'order_log.id',
  //       'order_log.userId',
  //       'order_log.orderId',
  //       'order_log.type',
  //       'order_log.message',
  //       'order_log.status',
  //       'order_log.createdAt',
  //       'order_log.updatedAt',
  //       'user.id',
  //       'user.firstName',
  //       'user.lastName',
  //       'user.email',
  //       'user.phone',
  //       'user.avatar',
  //     ])
  //     .take(perPage)
  //     .skip(currentPage * perPage)
  //     .getManyAndCount();

  //   return {
  //     data: logs,
  //     perPage: perPage,
  //     currentPage: currentPage + 1,
  //     totalPage: Math.ceil(total / perPage),
  //     totalResult: total,
  //   };
  // }

  // getCustomePrice(measure: number, objects: { size: number; price: number }[]) {
  //   let selectedPrice = 0;

  //   for (let i = 0; i < objects.length; i++) {
  //     // if (measure < objects[0].size) {
  //     //   selectedPrice = objects[0].price;
  //     //   break;
  //     // }
  //     if (measure >= objects[i].size) {
  //       selectedPrice = objects[i].price;
  //     } else {
  //       break;
  //     }
  //   }

  //   return selectedPrice;
  // }
}
