import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvalProdutoDto } from './dto/create-aval-produto.dto';
import { UpdateAvalProdutoDto } from './dto/update-aval-produto.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AvalProdutoService {
  constructor(private prisma: PrismaService){}
  
  async create(createAvalProdutoDto: CreateAvalProdutoDto, userId: number, produtoId: number) {
    const produto = await this.prisma.produtos.findUnique({
      where: {id: produtoId},
    });

    if (!produto) {
      throw new NotFoundException('O produto não existe');
    }
    
    return this.prisma.avaliacao_produto.create({
      data:{
        nota: createAvalProdutoDto.nota,
        comentario: createAvalProdutoDto.comentario,
        id_produto: produtoId,
        id_usuario: userId,
      },
    });
  }

  async findAllByProduct(produtoId: number) {
    return this.prisma.avaliacao_produto.findMany({
      where: {id_produto: produtoId},
      include: {
        usuario: {
          select: {nome: true, username: true , foto_perfil_url: true},
        },
      },
    });
  }

  async findOne(id: number){
    const avaliacao = await this.prisma.avaliacao_produto.findUnique({
      where: {id},
    });

    if (!avaliacao) {
      throw new NotFoundException('Avaliacao nao encontrada.');
    }

    return avaliacao
  }

  async update(id: number, userId: number, updateDto: Partial<CreateAvalProdutoDto>){
    const avaliacao = await this.findOne(id);

    if (avaliacao.id_usuario !== userId){
      throw new ForbiddenException('Voce nao tem permissao pra atualizar essa avaliacao.');
    }

    return this.prisma.avaliacao_produto.update({
      where: {id},
      data: updateDto,
    });
  }

  async remove(id: number, userId: number){
    const avaliacao = await this.findOne(id);

    if (avaliacao.id_usuario !== userId){
      throw new ForbiddenException('Voce nao tem permissao pra atualizar essa avaliacao.');
    }

    await this.prisma.avaliacao_produto.delete({
      where: {id},
    });

    return {message: 'Avaliacao removida.'};
  }
}
