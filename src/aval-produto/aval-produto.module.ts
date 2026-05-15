import { Module } from '@nestjs/common';
import { AvalProdutoService } from './aval-produto.service';
import { AvalProdutoController } from './aval-produto.controller';

@Module({
  controllers: [AvalProdutoController],
  providers: [AvalProdutoService],
})
export class AvalProdutoModule {}
