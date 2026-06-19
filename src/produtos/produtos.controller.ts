import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; 
import { extname } from 'path';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(createProdutoDto);
  }
  
  @UseGuards(AuthGuard) // apenas logados poderao criar
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
  uploadImagem(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('ordem') ordem: string
  ) {
    // ==========================================
    // CORREÇÃO: Passamos o 'file' e não uma string
    // ==========================================
    return this.produtosService.salvarImagem(+id, file, +ordem || 1);
  }

  @Get() // Achar 
  findAll(@Query('busca') busca?: string) {
    return this.produtosService.findAll(busca);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id') // Atualizar 
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtosService.update(+id, updateProdutoDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id') // Deletar
  remove(@Param('id') id: string) {
    return this.produtosService.remove(+id);
  }
}