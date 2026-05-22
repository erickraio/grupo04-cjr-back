import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

 @UseGuards(AuthGuard)// apenas logados poderao criar
  @Post()// criar
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(createProdutoDto);
  }

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
