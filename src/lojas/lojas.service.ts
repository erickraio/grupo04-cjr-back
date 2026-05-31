import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LojasService {
  constructor(private prisma: PrismaService) {}
  async create(dados: any) {
    return this.prisma.lojas.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        id_dono: dados.id_dono,
        banner_url: dados.banner_url,
        logo_url: dados.logo_url,
        foto_url: dados.foto_url,
      },
    });
  }
  async findAll() {
    return this.prisma.lojas.findMany();
  }
  async findOne(id: number) {
    return this.prisma.lojas.findUnique({
      where: { id },
      include: {
        produtos: {
          include: {
            imagens: true,
          }
        }
      }
    });
  }
  async update(id: number, dados: any) {
    return this.prisma.lojas.update({
      where: { id },
      data: dados,
    });
  }
  async remove(id: number) {
    return this.prisma.lojas.delete({
      where: { id },
    });
  }
}