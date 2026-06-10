import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.categorias.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    return this.prisma.categorias.findMany({
      where: {
        id_cat_pai: { not: null }, // retorna só subcategorias
      },
    });
  }

  findOne(id: number) {
    return this.prisma.categorias.findUnique({
      where: { id },
      include: {
        subcategorias: true,
        categoriaPai: true,
      },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.categorias.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.categorias.delete({
      where: { id },
    });
  }
}