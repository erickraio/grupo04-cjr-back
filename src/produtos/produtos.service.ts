import { Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from 'src/prisma.service';
import { Express } from 'express';

@Injectable()
export class ProdutosService {
  
  constructor(private prisma: PrismaService) { }

  async create(createProdutoDto: CreateProdutoDto) {
    // Separa o campo imagem_produto (que vem vazio do DTO) do resto dos dados
    // Isto evita que o Prisma tente criar uma relação vazia e dê erro
    const { imagem_produto, ...dadosDoProduto } = createProdutoDto;

    return this.prisma.produtos.create({
      data: dadosDoProduto,
    });
  }

  async findAll(busca?: string) {
    return this.prisma.produtos.findMany({
      where: busca ? {
        nome: {
          contains: busca,
          mode: 'insensitive',
        },
      } : {},
      include: {
        loja: true,
        categoria: true, // acha as categorias do produto 
        imagens: true
      }
    });
  }

  async findOne(id: number){
    const produtoExists = await this.prisma.produtos.findUnique({
      where: {id},
    });
    if (!produtoExists) {
      throw new Error("Produto não encontrado.");
    }
    return this.prisma.produtos.findUnique({
      where: {id},
      include: {
        categoria: true,
        imagens: true,
        loja: true
      }
    });
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    const produtoExists = await this.prisma.produtos.findUnique({
      where: {id},
    });
    if (!produtoExists) {
      throw new Error("Produto não encontrado.");
    }
    return this.prisma.produtos.update({
      where: { id },
      data: updateProdutoDto, 
    });
  }

  async remove(id: number) {
    // 1. Verifica se o produto existe
    await this.findOne(id);
    
    // 2. Apaga primeiro todas as imagens atreladas ao produto
    await this.prisma.imagem_produto.deleteMany({
      where: { id_produto: id },
    });

    // 3. Apaga também as avaliações deste produto (para não dar o mesmo erro)
    await this.prisma.avaliacao_produto.deleteMany({
      where: { id_produto: id },
    });

    // 4. Agora sim, com os "filhos" apagados, deletamos o produto com segurança
    await this.prisma.produtos.delete({
      where: { id }, 
    });
    
    return { message: 'Produto deletado com sucesso!' };
  }

  // =========================================================
  // CORREÇÃO AQUI: Agora recebe o ficheiro e extrai o nome
  // =========================================================
  async salvarImagem(idProduto: number, file: Express.Multer.File, ordem: number) {
    if (!file) throw new Error("Nenhuma imagem foi enviada.");

    // Constrói o caminho relativo que o Front-End vai conseguir ler
    const urlImagem = `/uploads/produtos/${file.filename}`;

    return this.prisma.imagem_produto.create({
      data: {
        id_produto: idProduto,
        url_imagem: urlImagem,
        ordem: ordem,
      },
    });
  }
  
}