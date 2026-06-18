import { Module } from '@nestjs/common';
import { CarrinhoController } from './carrinho.controller';
import { CarrinhoService } from './carrinho.service';
import { PrismaService } from '../prisma.service'; // Ajuste o caminho se o seu PrismaService estiver em outro local

@Module({
  controllers: [CarrinhoController],
  providers: [CarrinhoService, PrismaService],
})
export class CarrinhoModule {}