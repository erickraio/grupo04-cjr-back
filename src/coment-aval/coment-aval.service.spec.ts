import { Test, TestingModule } from '@nestjs/testing';
import { ComentAvalService } from './coment-aval.service';

describe('ComentAvalService', () => {
  let service: ComentAvalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComentAvalService],
    }).compile();

    service = module.get<ComentAvalService>(ComentAvalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
