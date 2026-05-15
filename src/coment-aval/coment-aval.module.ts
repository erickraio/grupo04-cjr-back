import { Module } from '@nestjs/common';
import { ComentAvalService } from './coment-aval.service';
import { ComentAvalController } from './coment-aval.controller';

@Module({
  controllers: [ComentAvalController],
  providers: [ComentAvalService],
})
export class ComentAvalModule {}
