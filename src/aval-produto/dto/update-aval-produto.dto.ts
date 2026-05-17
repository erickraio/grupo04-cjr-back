import { PartialType } from '@nestjs/mapped-types';
import { CreateAvalProdutoDto } from './create-aval-produto.dto';

export class UpdateAvalProdutoDto extends PartialType(CreateAvalProdutoDto) {}
