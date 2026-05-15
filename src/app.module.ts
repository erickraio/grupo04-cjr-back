import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';

import { ProdutosModule } from './produtos/produtos.module';

import { LojasModule } from './lojas/lojas.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, LojasModule,ProdutosModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
