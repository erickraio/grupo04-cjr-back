import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { AvalLojaService } from './aval-loja.service';
import { CreateAvalLojaDto } from './dto/create-aval-loja.dto';
import { UpdateAvalLojaDto } from './dto/update-aval-loja.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('aval-loja')
export class AvalLojaController {
  constructor(private readonly avalLojaService: AvalLojaService) {}

  @UseGuards(AuthGuard)
  @Post(':lojaId')
  async create(@Param('lojaId', ParseIntPipe) lojaId: number, @Body() createAvalLojaDto: CreateAvalLojaDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.avalLojaService.create(createAvalLojaDto, userId, lojaId);
  }

  @Get('loja/:lojaId')
  async findAllByLoja(@Param('lojaId', ParseIntPipe) lojaId: number) {
    return this.avalLojaService.findAllByLoja(lojaId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAvalLojaDto: UpdateAvalLojaDto, @Req() req: any ) {
    const userId = req.user.sub;
    return this.avalLojaService.update(id, userId, updateAvalLojaDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.sub;
    return this.avalLojaService.remove(id, userId);
  }
}
