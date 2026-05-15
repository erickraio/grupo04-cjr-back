import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
<<<<<<< HEAD
import { ProdutosModule } from './produtos/produtos.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, ProdutosModule],
=======
import { LojasModule } from './lojas/lojas.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, LojasModule],
>>>>>>> 1b765d516fdc2e13abf872a8496c0da2d13119c8
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
