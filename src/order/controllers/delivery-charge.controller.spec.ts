import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryChargeService } from '../services/delivery-charge.service';
import { DeliveryChargeController } from './delivery-charge.controller';

describe('DeliveryChargeController', () => {
  let controller: DeliveryChargeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryChargeController],
      providers: [DeliveryChargeService],
    }).compile();

    controller = module.get<DeliveryChargeController>(DeliveryChargeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
