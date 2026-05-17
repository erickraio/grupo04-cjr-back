import { Test, TestingModule } from '@nestjs/testing';
import { AvalLojaController } from './aval-loja.controller';
import { AvalLojaService } from './aval-loja.service';

describe('AvalLojaController', () => {
  let controller: AvalLojaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvalLojaController],
      providers: [AvalLojaService],
    }).compile();

    controller = module.get<AvalLojaController>(AvalLojaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
