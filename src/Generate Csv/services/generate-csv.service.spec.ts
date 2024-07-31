import { Test, TestingModule } from '@nestjs/testing';
import { GenerateCsvService } from './generate-csv.service';

describe('ReportService', () => {
  let service: GenerateCsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateCsvService],
    }).compile();

    service = module.get<GenerateCsvService>(GenerateCsvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
