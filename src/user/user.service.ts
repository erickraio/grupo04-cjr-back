import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // --- CADASTRAR ---
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

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.prisma.usuarios.create({
      data: {
        nome: data.name, 
        username: data.username,
        email: data.email,
        senha_hash: hashedPassword, 
      },
    });

    const { senha_hash, ...result } = newUser;
    return result;
  } 

  // --- LER (Read) ---
  async findOne(id: number) {
    const user = await this.prisma.usuarios.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const { senha_hash, ...result } = user;
    return result;
  }

  // --- ATUALIZAR (Update) ---
  async update(id: number, updateData: UpdateUserDto) {
    await this.findOne(id); 

    const dataToUpdate: any = {};
    if (updateData.name) dataToUpdate.nome = updateData.name;
    if (updateData.username) dataToUpdate.username = updateData.username;
    if (updateData.email) dataToUpdate.email = updateData.email;
    
    if (updateData.password) {
      dataToUpdate.senha_hash = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.prisma.usuarios.update({
      where: { id },
      data: dataToUpdate,
    });

    const { senha_hash, ...result } = updatedUser;
    return result;
  }

  // --- DELETAR (Delete) ---
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.usuarios.delete({
      where: { id },
    });

    return { message: 'Usuário deletado com sucesso.' };
  }
}