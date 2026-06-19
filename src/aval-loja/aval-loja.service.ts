import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateAvalLojaDto } from './dto/create-aval-loja.dto';
import { UpdateAvalLojaDto } from './dto/update-aval-loja.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AvalLojaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAvalLojaDto: CreateAvalLojaDto, userId:number, lojaId:number) {
    const lojaExiste = await this.prisma.lojas.findUnique({
      where: { id: lojaId },
    });

    if (!lojaExiste) {
      throw new NotFoundException('Loja não encontrada');
    }

    return this.prisma.avaliacao_loja.create({
      data: {
        nota: createAvalLojaDto.nota,
        comentario: createAvalLojaDto.comentario,
        id_usuario: userId,
        id_loja: lojaId,
      },
    });
  }

  async findOne(id: number) {
    const avaliacao = await this.prisma.avaliacao_loja.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            nome: true,
            username: true,
            foto_perfil_url: true,
          },
        },
        comentarios: {
          include: {
            usuario: {
              select: {
                nome: true,
                username: true,
                foto_perfil_url: true,
              },
            },
          },
        },
      },
    });

    if (!avaliacao) {
      throw new NotFoundException('Avaliação não encontrada');
    }
    return avaliacao;
  }

  async findAllByLoja(lojaId: number) {
    return this.prisma.avaliacao_loja.findMany({
      where: { id_loja: lojaId },
      include: { usuario: {
        select: {
          nome: true,
        },
      },
    },
    orderBy: { created_at: 'desc' },
    });
  }

  async update(id: number,userId:number, updateAvalLojaDto: UpdateAvalLojaDto) {
    const avaliacao = await this.findOne(id);

    if (avaliacao.id_usuario !== userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar esta avaliação');
    }
    return this.prisma.avaliacao_loja.update({
      where: { id },
      data: updateAvalLojaDto,
    });
  }

  async remove(id: number, userId:number) {
    const avaliacao = await this.findOne(id);
    if (!avaliacao) {
      throw new NotFoundException('Avaliação não encontrada');
    }
    if (avaliacao.id_usuario !== userId) {
      throw new ForbiddenException('Você não tem permissão para remover esta avaliação');
    }
    return this.prisma.avaliacao_loja.delete({
      where: { id },
    });
  }
}
