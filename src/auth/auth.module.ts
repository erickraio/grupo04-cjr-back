import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'chave_secreta_super_segura_cjr', // Em produção, isso fica no arquivo .env
      signOptions: { expiresIn: '1d' }, // O token expira em 1 dia
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}