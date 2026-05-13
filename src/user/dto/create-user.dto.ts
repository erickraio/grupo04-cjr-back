import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome completo é obrigatório' })
  @IsString()
  name: string | undefined;

  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  @IsString()
  username: string | undefined;

  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  email: string | undefined;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string | undefined;
}