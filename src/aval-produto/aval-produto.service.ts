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
      where: { id },
      include: {
        usuario: {
          select: { id: true, nome: true, username: true, foto_perfil_url: true }
        },
        produto: {
          include: {
            loja: true
          }
        },
        comentarios: {
          include: {
            usuario: {
              select: { id: true, nome: true, username: true, foto_perfil_url: true }
            }
          },
          orderBy: { created_at: 'asc' }
        }
      }
    });

    if (!avaliacao) {
      throw new NotFoundException('Avaliação não encontrada.');
    }

    const donoLojaId = avaliacao.produto?.loja?.id_dono;

    const comentariosFormatados = avaliacao.comentarios.map((coment) => ({
      ...coment,
      isDonoLoja: coment.id_usuario === donoLojaId,
    }));

    return {
      ...avaliacao,
      comentarios: comentariosFormatados,
    };
  }

  async update(id: number, userId: number, updateDto: Partial<CreateAvalProdutoDto>){
    const avaliacao = await this.prisma.avaliacao_produto.findUnique({ where: { id } });

    if (!avaliacao) throw new NotFoundException('Avaliação não encontrada.');
    if (avaliacao.id_usuario !== userId){
      throw new ForbiddenException('Você não tem permissão para atualizar essa avaliação.');
    }

    return this.prisma.avaliacao_produto.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number, userId: number){
    const avaliacao = await this.prisma.avaliacao_produto.findUnique({ where: { id } });

    if (!avaliacao) throw new NotFoundException('Avaliação não encontrada.');
    if (avaliacao.id_usuario !== userId){
      throw new ForbiddenException('Você não tem permissão para remover essa avaliação.');
    }

    await this.prisma.avaliacao_produto.delete({ where: { id } });
    return { message: 'Avaliação removida.' };
  }

  async addComment(idAvaliacao: number, userId: number, comentarioText: string) {
    return this.prisma.comentario_avaliacao.create({
      data: {
        id_avaliacao_produto: idAvaliacao,
        id_usuario: userId,
        comentario: comentarioText,
      },
    });
  }

  async updateComment(idComentario: number, userId: number, comentarioText: string) {
    const coment = await this.prisma.comentario_avaliacao.findUnique({ where: { id: idComentario } });
    if (!coment) throw new NotFoundException('Comentário não encontrado.');
    if (coment.id_usuario !== userId) {
      throw new ForbiddenException('Você não pode editar o comentário de outro usuário.');
    }

    return this.prisma.comentario_avaliacao.update({
      where: { id: idComentario },
      data: { comentario: comentarioText },
    });
  }
}