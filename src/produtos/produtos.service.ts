import { Injectable, UseGuards } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) { }
 async  create(createProdutoDto: CreateProdutoDto) {
  return this.prisma.produtos.create({
    data: {
      nome: createProdutoDto.nome,
      preco: createProdutoDto.preco,
      estoque: createProdutoDto.estoque,
      id_loja: createProdutoDto.id_loja,
      id_categoria: createProdutoDto.id_categoria,
      descricao: createProdutoDto.descricao ?? '',
    },
})
  }

   async findAll(){
    return this.prisma.produtos.findMany({
        include:{
          categoria: true  //acha as categorias do produto 
        }
    });
  }

async  findOne(id : number){
  const produtoExists = await this.prisma.produtos.findUnique({
      where: {id},
    });
    if(!produtoExists){
      throw new Error("Produto não encontrado.");
    }
    return this.prisma.produtos.findUnique({
       where: {id},
         include: {
        categoria: true
      
    }});
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    const produtoExists = await this.prisma.produtos.findUnique({
      where: {id},
    });
    if(!produtoExists){
      throw new Error("Produto não encontrado.");
    }
    return this.prisma.produtos.update({
      where: { id },
      data: updateProdutoDto, 
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    
    await this.prisma.produtos.delete({
      where: { id }, 
    });
     return { message: 'Produto deletado!' };
  }

  
}
