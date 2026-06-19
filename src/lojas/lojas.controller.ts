import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LojasService } from './lojas.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { AuthGuard } from '../auth/auth.guard'; // Ajuste o caminho '..' se necessário para a sua estrutura

@Controller('lojas')
export class LojasController {
  constructor(private readonly lojasService: LojasService) {}

  @UseGuards(AuthGuard) // Protege a criação de lojas
  @Post()
  create(@Body() createLojaDto: CreateLojaDto) {
    return this.lojasService.create(createLojaDto);
  }

  @Get()
  findAll() {
    return this.lojasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lojasService.findOne(+id);
  }

  @UseGuards(AuthGuard) // Protege a edição de lojas
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'foto_url', maxCount: 1 },
    { name: 'logo_url', maxCount: 1 },
    { name: 'banner_url', maxCount: 1 },
  ], {
    storage: diskStorage({
      destination: './uploads/lojas', // Pasta onde as imagens da loja serão salvas
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      }
    })
  }))
  update(
    @Param('id') id: string, 
    @Body() updateLojaDto: any,
    @UploadedFiles() files: { foto_url?: Express.Multer.File[], logo_url?: Express.Multer.File[], banner_url?: Express.Multer.File[] }
  ) {
    // Se o utilizador enviou ficheiros novos na modal, atualizamos o caminho
    if (files?.foto_url) updateLojaDto.foto_url = `/uploads/lojas/${files.foto_url[0].filename}`;
    if (files?.logo_url) updateLojaDto.logo_url = `/uploads/lojas/${files.logo_url[0].filename}`;
    if (files?.banner_url) updateLojaDto.banner_url = `/uploads/lojas/${files.banner_url[0].filename}`;

    return this.lojasService.update(+id, updateLojaDto);
  }

  @UseGuards(AuthGuard) // Protege a exclusão de lojas
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lojasService.remove(+id);
  }
}