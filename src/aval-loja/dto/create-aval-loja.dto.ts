import { IsNotEmpty, IsOptional, Min, Max, IsString } from "class-validator";

export class CreateAvalLojaDto {
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  nota!: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}
