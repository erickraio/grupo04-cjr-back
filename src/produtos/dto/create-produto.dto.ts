import { avaliacao_produto, categorias, imagem_produto, lojas } from "@prisma/client";
import { IsArray, IsInt, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProdutoDto {
   @IsString() @IsNotEmpty({message: 'Nome do produto vazio'})
  nome !: string;

  @IsString() @IsNotEmpty()
  descricao !: string;

  @IsNumber()
  @IsNotEmpty({message: 'Digite o valor do preco'})
  preco !: number;

  @IsNumber()@IsNotEmpty({message: 'Digite o numero de estoque'})
  estoque !: number;

  @IsNumber() @IsNotEmpty({message: 'Id da loja vazio'})
  id_loja !: number; 

  @IsNumber() @IsNotEmpty({message: 'Id da categoria vazio'})
  id_categoria !: number;

  @IsArray({message: 'Digite um array de avaliações'})
  @IsString({each: true, message: 'Cada imagem deve ser um URL em formato de texto'})
  @IsOptional()
  imagem_produto?: imagem_produto[];
   
}
