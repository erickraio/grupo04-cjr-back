import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  ParseIntPipe, 
  BadRequestException,
  UnauthorizedException,
  Req
} from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';

@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  // Função auxiliar para pegar o ID do token sem precisar de um Guard
  private extrairUsuarioId(req: any): number {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token mal formatado');
    }

    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8'));
      // No seu front-end o ID está salvo em payload.sub
      if (!payload.sub) {
         throw new UnauthorizedException('ID do usuário não encontrado no token');
      }
      return Number(payload.sub);
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  @Get()
  async obterCarrinho(@Req() req: any) {
    const usuarioId = this.extrairUsuarioId(req);
    return this.carrinhoService.getCarrinho(usuarioId);
  }

  @Post()
  async adicionarItem(@Req() req: any, @Body() body: any) {
    const usuarioId = this.extrairUsuarioId(req);
    const produtoId = Number(body.produtoId || body.produto_id);
    const quantidade = Number(body.quantidade);

    if (!produtoId || isNaN(produtoId)) {
      throw new BadRequestException('O campo produtoId é obrigatório e deve ser um número válido.');
    }
    
    if (!quantidade || isNaN(quantidade)) {
      throw new BadRequestException('O campo quantidade é obrigatório e deve ser um número válido.');
    }

    return this.carrinhoService.adicionarOuAtualizar(usuarioId, produtoId, quantidade);
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
}