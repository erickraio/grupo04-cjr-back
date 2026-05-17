import { PartialType } from '@nestjs/mapped-types';
import { CreateComentAvalDto } from './create-coment-aval.dto';

export class UpdateComentAvalDto extends PartialType(CreateComentAvalDto) {}
