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
    const loja = await this.prisma.lojas.findUnique({
      where: { id },
      include: {
        produtos: {
          include: {
            imagens: true,
          }
        },
        avaliacoes: {
          include: {
            usuario: true,
          }
        }
      }
    });
    if (!loja) { return null; }
    
    const totalAvaliacoes = loja.avaliacoes?.length || 0;
    const somaAvaliacoes = loja.avaliacoes?.reduce((soma, avaliacao) => soma+avaliacao.nota, 0) || 0;
    const mediaAvaliacoes = totalAvaliacoes > 0 ? somaAvaliacoes / totalAvaliacoes : 0;

    return {
      ...loja,
      estrelas: mediaAvaliacoes,
      totalAvaliacoes: totalAvaliacoes,
    };
  }
  async update(id: number, dados: any) {
    // 1. Tiramos a "gambiarra" anterior e pegamos todos os dados
    const { categoria, ...dadosValidos } = dados; 

    // 2. Garantimos que o ID da categoria seja um Número (pois o Front envia como Texto no FormData)
    if (dadosValidos.id_categoria) {
      dadosValidos.id_categoria = Number(dadosValidos.id_categoria);
    }

    return this.prisma.lojas.update({
      where: { id },
      data: dadosValidos,
    });
  }
  async remove(id: number) {
    // 1. Apaga avaliações feitas a esta loja
    await this.prisma.avaliacao_loja.deleteMany({
      where: { id_loja: id }
    });

    // 2. Busca os produtos desta loja e apaga as imagens e avaliações deles primeiro
    const produtos = await this.prisma.produtos.findMany({ where: { id_loja: id } });
    for (const prod of produtos) {
      await this.prisma.imagem_produto.deleteMany({ where: { id_produto: prod.id } });
      await this.prisma.avaliacao_produto.deleteMany({ where: { id_produto: prod.id } });
    }

    // 3. Apaga os produtos em si
    await this.prisma.produtos.deleteMany({
      where: { id_loja: id }
    });

    // 4. Agora sim, apaga a loja de forma segura
    return this.prisma.lojas.delete({
      where: { id },
    });
  }
}