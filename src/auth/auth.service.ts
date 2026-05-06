import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

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

  async forgotPassword(data: ForgotPasswordDto) {
  const user = await this.prisma.usuarios.findUnique({ where: { email: data.email } });

  if (!user) {
    throw new NotFoundException('Usuário não encontrado.');
  }

  // Gera um token aleatório de 6 caracteres (pode ser maior se preferir)
  const token = crypto.randomBytes(3).toString('hex').toUpperCase();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // Expira em 1 hora

  // Salva no banco de dados
  await this.prisma.passwordReset.create({
    data: {
      email: data.email,
      token: token,
      expiresAt: expiresAt,
    },
  });

  // Em um sistema real, aqui você enviaria o e-mail. 
  // Por enquanto, vamos retornar o token para você testar no Postman.
  return { message: 'Código de recuperação enviado para o e-mail.', token };
}

async resetPassword(data: ResetPasswordDto) {
  // 1. Busca o token no banco
  const resetEntry = await this.prisma.passwordReset.findUnique({
    where: { token: data.token },
  });

  if (!resetEntry || resetEntry.expiresAt < new Date()) {
    throw new UnauthorizedException('Token inválido ou expirado.');
  }

  // 2. Faz o hash da nova senha
  const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

  // 3. Atualiza a senha do usuário
  await this.prisma.usuarios.update({
    where: { email: resetEntry.email },
    data: { senha_hash: hashedNewPassword },
  });

  // 4. Deleta o token para que não seja usado de novo
  await this.prisma.passwordReset.delete({ where: { id: resetEntry.id } });

  return { message: 'Senha redefinida com sucesso!' };
}

}