import { avaliacao_produto, categorias, imagem_produto, lojas } from "@prisma/client";
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProdutoDto {
   @IsString() @IsNotEmpty()
  nome !: string;

  @IsString() @IsNotEmpty()
  descricao !: string;

  @IsNumber()
  preco !: number;

  @IsInt()
  estoque !: number;

  @IsInt() @IsNotEmpty()
  id_loja !: number; 

  @IsInt() @IsNotEmpty()
  id_categoria !: number;
   
}
