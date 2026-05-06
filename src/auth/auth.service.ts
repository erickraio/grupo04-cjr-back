import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(data: LoginDto) {
    // 1. Busca o usuário pelo e-mail
    const user = await this.prisma.usuarios.findUnique({
      where: { email: data.email },
    });

    // 2. Se não achar o usuário, retorna Erro 401
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 3. Compara a senha digitada com a senha protegida do banco
    const isPasswordValid = await bcrypt.compare(data.password, user.senha_hash);

    // 4. Se a senha estiver errada, retorna Erro 401
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.'); 
    }

    // 5. Se tudo der certo, gera o "crachá" (Token JWT)
    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}