import { PartialType } from '@nestjs/mapped-types';
import { CreateAvalLojaDto } from './create-aval-loja.dto';

export class UpdateAvalLojaDto extends PartialType(CreateAvalLojaDto) {}
