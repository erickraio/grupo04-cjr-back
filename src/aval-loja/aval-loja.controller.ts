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

  @Get()
  findAll() {
    return this.avalLojaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avalLojaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvalLojaDto: UpdateAvalLojaDto) {
    return this.avalLojaService.update(+id, updateAvalLojaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avalLojaService.remove(+id);
  }
}
