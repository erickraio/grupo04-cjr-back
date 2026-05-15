import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { LojasModule } from './lojas/lojas.module';
import { AvalProdutoModule } from './aval-produto/aval-produto.module';
import { AvalLojaModule } from './aval-loja/aval-loja.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, LojasModule, AvalProdutoModule, AvalLojaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
