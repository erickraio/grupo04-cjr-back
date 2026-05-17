import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ComentAvalService } from './coment-aval.service';
import { CreateComentAvalDto } from './dto/create-coment-aval.dto';
import { UpdateComentAvalDto } from './dto/update-coment-aval.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('coment-aval')
export class ComentAvalController {
  constructor(private readonly comentAvalService: ComentAvalService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createComentAvalDto: CreateComentAvalDto, @Req() req) {
    const userId = req.user.sub;
    return this.comentAvalService.create(createComentAvalDto, userId);
  }

  @Get('produto/:id_avaliacao_produto')
  async findByProduto(@Param('id_avaliacao_produto', ParseIntPipe) id_avaliacao_produto: number) {
    return this.comentAvalService.findAllByProduto(id_avaliacao_produto);
  }

  @Get('loja/:id_avaliacao_loja')
  async findByLoja(@Param('id_avaliacao_loja', ParseIntPipe) id_avaliacao_loja: number) {
    return this.comentAvalService.findAllByLoja(id_avaliacao_loja);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateComentAvalDto: UpdateComentAvalDto, @Req() req) {
    const userId = req.user.sub;
    return this.comentAvalService.update(id, userId, updateComentAvalDto);
  }

  @UseGuards(AuthGuard) 
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.sub;
    return this.comentAvalService.remove(id, userId);
  }
}
