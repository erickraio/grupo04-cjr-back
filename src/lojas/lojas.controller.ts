import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LojasService } from './lojas.service';

@Controller('lojas')
export class LojasController {
  constructor(private readonly lojasService: LojasService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'banner', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
    { name: 'foto', maxCount: 1 },
  ], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(
    @Body() body: any,
    @UploadedFiles() files: {
      banner?: Express.Multer.File[];
      logo?: Express.Multer.File[];
      foto?: Express.Multer.File[];
    },
  ) {
    const bannerUrl = files?.banner?.[0] ? `/uploads/${files.banner[0].filename}` : undefined;
    const logoUrl = files?.logo?.[0] ? `/uploads/${files.logo[0].filename}` : undefined;
    const fotoUrl = files?.foto?.[0] ? `/uploads/${files.foto[0].filename}` : undefined;

    return this.lojasService.create({
      nome: body.nome,
      descricao: body.descricao || '',
      id_dono: Number(body.id_dono),
      banner_url: bannerUrl,
      logo_url: logoUrl,
      foto_url: fotoUrl,
      id_categoria: body.id_categoria ? Number(body.id_categoria) : null,
    });
  }

  @Get()
  findAll() {
    return this.lojasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lojasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLojaDto: any) {
    return this.lojasService.update(+id, updateLojaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lojasService.remove(+id);
  }
}
