import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CarrinhoService {
  constructor(private prisma: PrismaService) {}

  async getCarrinho(usuarioId: number) {
    return this.prisma.itemCarrinho.findMany({
      where: { usuario_id: usuarioId },
      include: {
        produto: true,
      },
    });
  }

  async adicionarOuAtualizar(usuarioId: number, produtoId: number, quantidade: number) {
    const itemExistente = await this.prisma.itemCarrinho.findFirst({
      where: { usuario_id: usuarioId, produto_id: produtoId },
    });

    if (itemExistente) {
      return this.prisma.itemCarrinho.update({
        where: { id: itemExistente.id },
        data: { quantidade: itemExistente.quantidade + quantidade },
      });
    }

    return this.prisma.itemCarrinho.create({
      data: {
        usuario_id: usuarioId,
        produto_id: produtoId,
        quantidade,
      },
    });
  }

  async atualizarQuantidade(itemId: number, quantidade: number) {
    if (quantidade <= 0) {
      return this.removerItem(itemId);
    }
    return this.prisma.itemCarrinho.update({
      where: { id: itemId },
      data: { quantidade },
    });
  }

  async removerItem(itemId: number) {
    return this.prisma.itemCarrinho.delete({
      where: { id: itemId },
    });
  }

  async finalizarCompra(usuarioId: number) {
    const itens = await this.getCarrinho(usuarioId);
    
    if (itens.length === 0) {
      throw new NotFoundException('O carrinho está vazio!');
    }

    const total = itens.reduce((sum, item) => sum + item.produto.preco * item.quantidade, 0);

    return this.prisma.$transaction(async (tx) => {

      const pedido = await tx.pedido.create({
        data: {
          usuario_id: usuarioId,
          total: total,
        },
      });

      const itensPedidoData = itens.map((item) => ({
        pedido_id: pedido.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_pago: item.produto.preco,
      }));

      await tx.itemPedido.createMany({
        data: itensPedidoData,
      });

      await tx.itemCarrinho.deleteMany({
        where: { usuario_id: usuarioId },
      });

      return { message: 'Compra finalizada com sucesso!', pedidoId: pedido.id };
    });
  }
}