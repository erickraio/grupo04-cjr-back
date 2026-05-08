import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado.');
    }

    try {
      // Verifica se o token é válido e decodifica as informações
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'chave_secreta_super_segura_cjr', // Deve ser a mesma do AuthModule
      });
      
      // Salva os dados do usuário na requisição para uso futuro
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}