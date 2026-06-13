import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { AvalProdutoService } from './aval-produto.service';
import { CreateAvalProdutoDto } from './dto/create-aval-produto.dto';
import { UpdateAvalProdutoDto } from './dto/update-aval-produto.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('aval-produto')
export class AvalProdutoController {
  constructor(private readonly avalProdutoService: AvalProdutoService) {}

  @UseGuards(AuthGuard)
  @Post(':produtoId')
  async create(@Param('produtoId', ParseIntPipe) produtoId: number, @Body() createAvalProdutoDto: CreateAvalProdutoDto, @Req() req:any) {
    const userId = req.user.sub;
    return this.avalProdutoService.create(createAvalProdutoDto, userId, produtoId);
  }

  @Get('produto/:produtoId')
  async findAllByProduct(@Param('produtoId', ParseIntPipe) produtoId: number) {
    return this.avalProdutoService.findAllByProduct(produtoId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.avalProdutoService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAvalProdutoDto: UpdateAvalProdutoDto, @Req() req:any) {
    const userId = req.user.sub;
    return this.avalProdutoService.update(id, userId, updateAvalProdutoDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req:any) {
    const userId = req.user.sub;
    return this.avalProdutoService.remove(id, userId);
  }
  @UseGuards(AuthGuard)
  @Post(':id/comentario')
  async addComment(@Param('id', ParseIntPipe) idAvaliacao: number, @Body('comentario') comentario: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.avalProdutoService.addComment(idAvaliacao, userId, comentario);
  }

  @UseGuards(AuthGuard)
  @Patch('comentario/:comentarioId')
  async updateComment(@Param('comentarioId', ParseIntPipe) comentarioId: number, @Body('comentario') comentario: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.avalProdutoService.updateComment(comentarioId, userId, comentario);
  }
}