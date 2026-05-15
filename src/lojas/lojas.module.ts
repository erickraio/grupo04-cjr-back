import { Module } from '@nestjs/common';
import { LojasService } from './lojas.service';
import { LojasController } from './lojas.controller';
import { PrismaModule } from '../prisma.module'

@Module({
  controllers: [LojasController],
  providers: [LojasService],
  imports: [PrismaModule],
})
export class LojasModule {}
