import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryChargeService } from './delivery-charge.service';

describe('DeliveryChargeService', () => {
  let service: DeliveryChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryChargeService],
    }).compile();

    service = module.get<DeliveryChargeService>(DeliveryChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
