import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { City } from 'src/modules/address/entities/city.entity';
// import { OrderService } from 'src/modules/order/services/order.service';
// import { ProductStatus } from 'src/modules/product/entities/product.entity';
// import { Sku } from 'src/modules/product/entities/sku.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateDeliveryChargeDto } from '../dto/create-delivery-charge.dto';
import { UpdateDeliveryChargeDto } from '../dto/update-delivery-charge.dto';
import {
  DeliveryCharge,
  DeliveryChargeType,
} from '../entities/delivery-charge.entity';
import { throwError } from 'src/common/errors/errors.function';
import { checkDiscountValidation } from 'src/common/helpers/helpers.function';
// import { checkDiscountValidation } from 'src/common/helpers/helpers.function';
// import { CategoryService } from 'src/modules/category/services/category.service';
// import { OfferService } from 'src/modules/offer/services/offer.service';

@Injectable()
export class DeliveryChargeService {
  constructor(
    @InjectRepository(DeliveryCharge)
    private deliveryChargeRepository: Repository<DeliveryCharge>,
    // @InjectRepository(Sku) private skuRepository: Repository<Sku>,
    // @InjectRepository(City)
    // private cityRepository: Repository<City>,
    // @Inject(forwardRef(() => OrderService))
    // private orderService: OrderService,
    // private categoryService: CategoryService,
    // private offerService: OfferService
  ) { }

  async create(user, createDeliveryChargeDto: CreateDeliveryChargeDto) {
    // Check delivery charge type
    if (createDeliveryChargeDto.type === DeliveryChargeType.INSIDE_DHAKA) {
      // Check if there is any inside Dhaka charge
      let insideDhakaCharge;
      try {
        insideDhakaCharge = await this.deliveryChargeRepository.findOne({
          where: {
            type: DeliveryChargeType.INSIDE_DHAKA,
          },
        });
      } catch (e) {
        throwError(500, [], 'Internal Server Error');
      }

      if (insideDhakaCharge) {
        throwError(400, [], 'There is already an inside Dhaka charge');
      }

      delete createDeliveryChargeDto.cityId;
    }

    if (createDeliveryChargeDto.type === DeliveryChargeType.OUTSIDE_DHAKA) {
      // Check if there is any inside Dhaka charge
      let outsideDhakaCharge;
      try {
        outsideDhakaCharge = await this.deliveryChargeRepository.findOne({
          where: {
            type: DeliveryChargeType.OUTSIDE_DHAKA,
          },
        });
      } catch (e) {
        throwError(500, [], 'Internal Server Error');
      }

      if (outsideDhakaCharge) {
        throwError(400, [], 'There is already an outside Dhaka charge');
      }

      delete createDeliveryChargeDto.cityId;
    }

    if (createDeliveryChargeDto.type === DeliveryChargeType.CUSTOM) {
      if (!createDeliveryChargeDto.cityId) {
        throwError(400, [], 'City ID is required');
      }

      let city;
      try {
        // city = await this.cityRepository.findOne({
        //   where: { id: createDeliveryChargeDto.cityId },
        // });
      } catch (e) {
        throwError(500, [], 'Internal Server Error');
      }

      if (!city) throwError(400, [], 'City not found');

      let customChargeExists;
      try {
        customChargeExists = await this.deliveryChargeRepository.findOne({
          where: {
            type: DeliveryChargeType.CUSTOM,
            // city: city,
          },
        });
      } catch (e) {
        throwError(500, [], 'Internal Server Error');
      }

      if (customChargeExists)
        throwError(400, [], 'Delivery charge already exists for this city');
    }

    try {
      const deliveryCharge = await this.deliveryChargeRepository.save(
        createDeliveryChargeDto,
      );

      return await this.deliveryChargeRepository.findOne({
        where: { id: deliveryCharge.id },
        relations: ['city'],
      });
    } catch (e) {
      console.log(e);
      throwError(500, [], 'Internal Server Error');
    }
  }

  async getBaseCharges(user) {
    try {
      return await this.deliveryChargeRepository.find({
        where: { type: Not(DeliveryChargeType.CUSTOM) },
      });
    } catch (e) {
      throwError(500, [], 'Internal Server Error');
    }
  }

  async getShopDeliveryCharge() {
    try {
      return await this.deliveryChargeRepository.find({
        where: { type: Not(DeliveryChargeType.CUSTOM) },
      });
    } catch (e) {
      throwError(500, [], e.message);
    }
  }

  async findAll(user, perPage = 10, currentPage = 0) {
    try {
      const [charges, total] = await this.deliveryChargeRepository.findAndCount(
        {
          where: { type: DeliveryChargeType.CUSTOM },
          order: { createdAt: 'DESC' },
          take: perPage,
          skip: currentPage * perPage,
        },
      );

      return {
        data: charges,
        perPage: perPage,
        currentPage: currentPage + 1,
        totalPage: Math.ceil(total / perPage),
        totalResult: total,
      };
    } catch (e) {
      throwError(500, [], 'Internal Server Error');
    }
  }

  async findOne(user, id: number) {
    return `This action returns a #${id} order`;
  }

  async update(
    user,
    id: number,
    updateDeliveryChargeDto: UpdateDeliveryChargeDto,
  ) {
    if (!id) throwError(400, [], 'ID is required');

    let deliveryCharge;
    try {
      deliveryCharge = await this.deliveryChargeRepository.findOne({
        where: { id: id },
      });
    } catch (e) {
      throwError(500, [], 'Internal Server Error');
    }

    if (!deliveryCharge) throwError(400, [], 'Delivery charge not found');

    try {
      await this.deliveryChargeRepository.update(id, updateDeliveryChargeDto);

      return await this.deliveryChargeRepository.findOne({
        where: { id: id },
        relations: ['city'],
      });
    } catch (e) {
      throwError(500, [], 'Internal Server Error');
    }
  }

  async remove(user, id: number) {
    if (!id) throwError(400, [], 'ID is required');

    let deliveryCharge;
    try {
      deliveryCharge = await this.deliveryChargeRepository.findOne({
        where: { id: id },
      });
    } catch (e) {
      throwError(500, [], 'Internal Server Error');
    }

    if (!deliveryCharge) throwError(400, [], 'Delivery charge not found');

    if (deliveryCharge.type !== DeliveryChargeType.CUSTOM)
      throwError(400, [], 'You can not delete base delivery charge');

    try {
      const result = await this.deliveryChargeRepository.delete(id);

      if (result && result.affected) {
        return { status: true };
      }
      return { status: false };
    } catch (e) {
      throwError(500, [], 'Internal Server Error');
    }
  }

  async getOrderDeliveryCharge(user, data) {
    // Get and Check order skus
    if (data.products.length === 0)
      throwError(400, [], 'Invalid products');
    let products;
    try {
      // products = await this.skuRepository.find({
      //   where: {
      //     id: In(data.products.map((product) => product.skuId)),
      //   },
      //   relations: ['product', 'product.category', 'product.brand'],
      // });
    } catch (error) {
      console.log(error);
      throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
    }

    if (products.length !== data.products.length) {
      throwError(400, [], 'Invalid products');
    }

    let skus = [];
    let preOrderAmount;

    // return products;
    skus = products.map(async (sku) => {
      // Check quantity is valid
      const quantity = data.products.find(
        (item) => item.skuId == sku.id,
      ).quantity;

      if (quantity > sku.quantity) throwError(400, [], 'Invalid quantity');

      preOrderAmount = sku?.preOrderPer ? sku?.preOrderPer : null;

      // Check product is active or not
      // if (sku.product.status !== ProductStatus.ACTIVE)
      //   throwError(400, [], 'Product is not active');

      const matchProduct = data.products.find(
        (item) => item.skuId === sku.id,
      );

      // let customeSizePrice: number = 0;
      const customeSizePrice: { name: string; size: number; price: number }[] =
        [];
      // check if measure exits or not
      // if (matchProduct.custom_sizes) {
      //   // // get category measurement
      //   const category = await this.categoryService.getCategoryMeasurements(
      //     sku.product.categoryId,
      //   );
      //   // loop through all custom sizes
      //   for (const customSizeWithKey of matchProduct?.custom_sizes) {
      //     // category measurement pricing parse
      //     const measurementPricing = JSON.parse(category.measurementPricing);
      //     // check if measurement exits or not
      //     const mainMeasurement = measurementPricing.find((measure) => {
      //       return measure?.name === customSizeWithKey?.key;
      //     });
      //     if (mainMeasurement) {
      //       const measurement = this.getCustomePrice(
      //         +customSizeWithKey.value,
      //         mainMeasurement?.values,
      //       );
      //       customeSizePrice.push({
      //         name: customSizeWithKey.key,
      //         size: Number(customSizeWithKey.value),
      //         price: Number(measurement),
      //       });
      //     } else {
      //       customeSizePrice.push({
      //         name: customSizeWithKey.key,
      //         size: Number(customSizeWithKey.value),
      //         price: 0,
      //       });
      //     }
      //   }
      // }

      // custome size amount
      let customeSizePriceAmount = customeSizePrice.reduce(
        (total, size) => total + size.price,
        0,
      );

      // if discount valid then calculate total price with discount
      const calcTotalPrice = checkDiscountValidation(
        true,
        sku.discountedPrice,
        sku.discountedPriceStart,
        sku.discountedPriceEnd,
      )
        ? sku.discountedPrice * quantity +
        customeSizePriceAmount * quantity +
        ((sku.vat * sku.discountedPrice) / 100) * quantity
        : sku.price * quantity +
        customeSizePriceAmount * quantity +
        ((sku.vat * sku.price) / 100) * quantity;

      return {
        productId: sku.product.id,
        skuId: sku.id,
        sku: sku.sku,
        customSku: sku.customSku,
        name: sku.product.name,
        slug: sku.product.slug,
        purchasePrice: sku.purchasePrice,
        price: sku.price,
        discountedPrice: checkDiscountValidation(
          true,
          sku.discountedPrice,
          sku.discountedPriceStart,
          sku.discountedPriceEnd,
        )
          ? sku.discountedPrice
          : 0,
        quantity: quantity,
        vat: sku.vat,
        insideDhaka: sku.product.insideDhaka,
        outsideDhaka: sku.product.outsideDhaka,
        warrantyType: sku.product.warrantyType,
        warranty: sku.product.warranty,
        customeSize: JSON.stringify(customeSizePrice),
        // measurementSize: matchProduct?.measurementSize,
        // add vat to total price
        // totalPrice:
        //   sku.discountedPrice * quantity +
        //   ((sku.vat * sku.discountedPrice) / 100) * quantity,
        totalPrice: calcTotalPrice,
        ...(sku.product.brand && { brand: sku.product.brand.name }),
        categoryId: sku.product?.category?.id,
        brandId: sku.product?.brand?.id,
        thumbnail: sku.product.thumbnail,
        attributes:
          matchProduct?.attributes?.map((item) => ({
            key: item.key,
            value: item.value,
          })) || [],
        discount: checkDiscountValidation(
          true,
          sku.discountedPrice,
          sku.discountedPriceStart,
          sku.discountedPriceEnd,
        ),
        status: 'Order Placed',
      };
    });

    skus = await Promise.all(skus);
    // return skus

    if (skus.length === 0) throwError(400, [], 'Invalid products');

    // get delivery charge
    const subtotal = skus.reduce((a, b) => a + b.totalPrice, 0);
    let deliverCharge = 0;
    // deliverCharge = await this.orderService.calculateDeliveryCharge(
    //   data.shippingCityId,
    //   skus,
    // );
    const grandTotal = subtotal;

    // const freeDeliveryData = await this.offerService.checkFreeDelivery(grandTotal);
    // if (freeDeliveryData && freeDeliveryData.status === true) {
    //   deliverCharge = 0;
    // }

    return { deliveryCharge: deliverCharge };
  }

  getCustomePrice(measure: number, objects: { size: number; price: number }[]) {
    let selectedPrice = 0;

    for (let i = 0; i < objects.length; i++) {
      // if (measure < objects[0].size) {
      //   selectedPrice = objects[0].price;
      //   break;
      // }
      if (measure >= objects[i].size) {
        selectedPrice = objects[i].price;
      } else {
        break;
      }
    }

    return selectedPrice;
  }
}
