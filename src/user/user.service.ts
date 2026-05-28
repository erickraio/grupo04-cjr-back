import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async register(data: CreateUserDto) {
    const userExists = await this.prisma.usuarios.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
        ],
      },
    });

    if (userExists) {
      throw new ConflictException('E-mail ou nome de usuário já estão em uso.');
    }

    const hashedPassword = await (bcrypt.hash(data.password!, 10) as Promise<string>);

    const newUser = await this.prisma.usuarios.create({
      data: {
        nome: data.name as string, 
        username: data.username as string,
        email: data.email as string,
        senha_hash: hashedPassword, 
      },
    });

    const { senha_hash, ...result } = newUser;
    return result;
  } 
  async findOne(id: number) {
    const user = await this.prisma.usuarios.findUnique({
      where: { id },
      include: {
        lojas: { 
          include: { 
            produtos: {
              include: {
                imagens: true 
              }
            } 
          } 
        },
        avaliacoes_produto: true,
        avaliacoes_loja: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }
async update(id: number, updateData: UpdateUserDto) {
    // 1. Guarda o usuário na variável para podermos comparar a senha antiga
    const user = await this.findOne(id); 

    const dataToUpdate: any = {};
    if (updateData.name) dataToUpdate.nome = updateData.name;
    if (updateData.username) dataToUpdate.username = updateData.username;
    if (updateData.email) dataToUpdate.email = updateData.email;
    if ((updateData as any).foto_perfil_url) {
      dataToUpdate.foto_perfil_url = (updateData as any).foto_perfil_url;
    }
    
    // ==========================================
    // LÓGICA DE ALTERAÇÃO DE SENHA COM VERIFICAÇÃO DA SENHA ANTIGA
    // ==========================================
    const payload = updateData as any; // Usando 'any' caso o DTO não tenha esses campos mapeados
    
    // Se o frontend enviou "senhaAntiga" e "senha" (nova)
    if (payload.senhaAntiga && payload.senha) {
      
      // Compara a senha antiga digitada com o hash que está no banco
      const isPasswordValid = await bcrypt.compare(payload.senhaAntiga, user.senha_hash);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('A senha antiga está incorreta.');
      }
      
      // Se estiver certa, criptografa a nova e salva
      dataToUpdate.senha_hash = await bcrypt.hash(payload.senha, 10);
      
    } else if (updateData.password) {
      // Mantém a lógica original como segurança, caso outro local da aplicação atualize só com "password"
      dataToUpdate.senha_hash = await bcrypt.hash(updateData.password, 10);
    }
    // ==========================================

    const updatedUser = await this.prisma.usuarios.update({
      where: { id },
      data: dataToUpdate,
      include: {
        lojas: { include: { produtos: { include: { imagens: true } } } },
        avaliacoes_produto: true,
        avaliacoes_loja: true,
      }
    });

    const { senha_hash, ...result } = updatedUser;
    return result;
  }
  async remove(id: number) {
    // 1. Verifica se o usuário realmente existe antes de tentar deletar
    await this.findOne(id);

    // 2. Deleta o usuário do banco de dados
    await this.prisma.usuarios.delete({
      where: { id },
    });

    return { message: 'Usuário deletado com sucesso.' };
  }
}