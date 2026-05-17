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

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateAvalProdutoDto: UpdateAvalProdutoDto, @Req() req:any) {
    const userId = req.user.sub;
    return this.avalProdutoService.update(id, userId, updateAvalProdutoDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req:any) {
    const userId = req.user.sub;
    return this.avalProdutoService.remove(id, userId);
  }
}
