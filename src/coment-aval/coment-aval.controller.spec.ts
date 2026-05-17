import { Test, TestingModule } from '@nestjs/testing';
import { ComentAvalController } from './coment-aval.controller';
import { ComentAvalService } from './coment-aval.service';

describe('ComentAvalController', () => {
  let controller: ComentAvalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComentAvalController],
      providers: [ComentAvalService],
    }).compile();

    controller = module.get<ComentAvalController>(ComentAvalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
