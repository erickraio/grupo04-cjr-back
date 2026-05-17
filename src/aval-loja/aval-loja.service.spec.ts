import { Test, TestingModule } from '@nestjs/testing';
import { AvalLojaService } from './aval-loja.service';

describe('AvalLojaService', () => {
  let service: AvalLojaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvalLojaService],
    }).compile();

    service = module.get<AvalLojaService>(AvalLojaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
