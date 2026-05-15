import { IsNotEmpty, IsOptional, Min, Max } from "class-validator";

export class CreateAvalProdutoDto {
    @IsNotEmpty({message: 'A nota é obrigatória.'})
    @Min(1)
    @Max(5)
    nota!: number;

    @IsOptional()
    comentario?: string;
}
