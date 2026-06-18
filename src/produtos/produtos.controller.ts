import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; 
import { extname } from 'path';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {Multer} from 'multer';



@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

@UseGuards(AuthGuard)
@Post(':id/imagens')
@UseInterceptors(FileInterceptor('imagem', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
}))
async uploadImagem(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Body('ordem') ordem: string,
) {
  return this.produtosService.salvarImagem(+id, `/uploads/${file.filename}`, +ordem || 1);
}
 @UseGuards(AuthGuard)// apenas logados poderao criar
  @Post()// criar
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(createProdutoDto);
  }
  
 @UseGuards(AuthGuard)// apenas logados poderao criar
  @Post(':id/imagens')
  @UseInterceptors(FileInterceptor('imagem', { 
    storage: diskStorage({
      destination: './uploads/produtos', // Pasta física onde será salvo
      filename: (req, file, cb) => {
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      }
    })
  }))
  
  @Get()// Achar 
  findAll(@Query('busca') busca?: string) {
    return this.produtosService.findAll(busca);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(+id);
  }

 @UseGuards(AuthGuard)
  @Patch(':id') //Atualizar 
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtosService.update(+id, updateProdutoDto);
  }

 @UseGuards(AuthGuard)
  @Delete(':id')//Deletar
  remove(@Param('id') id: string) {
    return this.produtosService.remove(+id);
  }
}

