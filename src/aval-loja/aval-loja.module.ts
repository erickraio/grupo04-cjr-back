import { Module } from '@nestjs/common';
import { AvalLojaService } from './aval-loja.service';
import { AvalLojaController } from './aval-loja.controller';

@Module({
  controllers: [AvalLojaController],
  providers: [AvalLojaService],
})
export class AvalLojaModule {}
