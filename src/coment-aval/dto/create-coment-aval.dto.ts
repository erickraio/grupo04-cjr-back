import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateComentAvalDto {
    @IsNotEmpty({message: "O comentário é obrigatório"})
    @IsString({message: "O comentário deve ser uma string"})
    comentario!: string;

    @IsOptional()
    @IsInt()
    id_avaliacao_produto?: number;

    @IsOptional()
    @IsInt()
    id_avaliacao_loja?: number;
}