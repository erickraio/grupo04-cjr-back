import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateComentAvalDto } from './dto/create-coment-aval.dto';
import { UpdateComentAvalDto } from './dto/update-coment-aval.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ComentAvalService {
  constructor(private prisma: PrismaService) {}

  async create(createComentAvalDto: CreateComentAvalDto, userId:number) {
    if (!createComentAvalDto.id_avaliacao_produto && !createComentAvalDto.id_avaliacao_loja) {
      throw new BadRequestException('A avaliação não existe.');
    }

    return this.prisma.comentario_avaliacao.create({
      data: {
        comentario: createComentAvalDto.comentario,
        id_usuario: userId,
        id_avaliacao_produto: createComentAvalDto.id_avaliacao_produto,
        id_avaliacao_loja: createComentAvalDto.id_avaliacao_loja,
      },
    });
  }

  async findAllByProduto(id_avaliacao_produto: number) {
    return this.prisma.comentario_avaliacao.findMany({
      where: { id_avaliacao_produto },
      include: {
        usuario: { select: {nome: true } }
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findAllByLoja(id_avaliacao_loja: number) {
    return this.prisma.comentario_avaliacao.findMany({
      where: { id_avaliacao_loja },
      include: {
        usuario: { select: {nome: true } }
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const comentAval = await this.prisma.comentario_avaliacao.findUnique({
      where: { id },
    });
    if (!comentAval) {
      throw new NotFoundException('Comentário não encontrado.');
    }
    return comentAval;
  }

  async update(id: number, userId: number, updateComentAvalDto: Partial<UpdateComentAvalDto>) {
    const comentExiste = await this.findOne(id);
    
    if (comentExiste.id_usuario !== userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar este comentário.');
    }
    
    return this.prisma.comentario_avaliacao.update({
      where: { id },
      data: {
        comentario: updateComentAvalDto.comentario,
      },
    });
  }

  async remove(id: number, userId: number) {
    const comentExiste = await this.findOne(id);

    if (comentExiste.id_usuario !== userId) {
      throw new ForbiddenException('Você não tem permissão para remover este comentário.');
    }

    await this.prisma.comentario_avaliacao.delete({
      where: { id },
    });

    return { message: 'Comentário removido com sucesso.' };
  }
}
