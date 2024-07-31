import { Test, TestingModule } from '@nestjs/testing';
import { GenerateCsvController } from './generate-csv.controller';

describe('ReportController', () => {
  let controller: GenerateCsvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateCsvController],
    }).compile();

    controller = module.get<GenerateCsvController>(GenerateCsvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
