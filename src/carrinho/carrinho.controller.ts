import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';

@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}
  
  // ATENÇÃO: Verifique se existe um registro com ID 1 na tabela de usuários do seu banco de dados.
  private readonly MOCK_USER_ID = 1;

  @Get()
  async obterCarrinho() {
    return this.carrinhoService.getCarrinho(this.MOCK_USER_ID);
  }

  @Post()
  async adicionarItem(@Body() body: any) {
    const produtoId = Number(body.produtoId || body.produto_id);
    const quantidade = Number(body.quantidade);

    if (!produtoId || isNaN(produtoId)) {
      throw new BadRequestException('O campo produtoId é obrigatório e deve ser um número válido.');
    }
    
    if (!quantidade || isNaN(quantidade)) {
      throw new BadRequestException('O campo quantidade é obrigatório e deve ser um número válido.');
    }

    return this.carrinhoService.adicionarOuAtualizar(this.MOCK_USER_ID, produtoId, quantidade);
  }

  @Patch('/:id')
  async atualizarQuantidade(
    @Param('id', ParseIntPipe) itemId: number,
    @Body('quantidade', ParseIntPipe) quantidade: number,
  ) {
    return this.carrinhoService.atualizarQuantidade(itemId, quantidade);
  }

  @Delete('/:id')
  async removerItem(@Param('id', ParseIntPipe) itemId: number) {
    return this.carrinhoService.removerItem(itemId);
  }

  @Post('finalizar')
  async finalizarCompra() {
    return this.carrinhoService.finalizarCompra(this.MOCK_USER_ID);
  }
}