# Análise do Backend — Stock.io (grupo04-cjr-back)

> **Data:** 18/06/2026
> **Stack:** NestJS 11 + Prisma ORM 6 + PostgreSQL (Neon) + JWT + bcrypt + Multer

---

## Sumário

1. [Estrutura do Projeto](#1-estrutura-do-projeto)
2. [Modelos do Banco (Prisma)](#2-modelos-do-banco-prisma)
3. [Módulos e Endpoints](#3-módulos-e-endpoints)
4. [Autenticação e Autorização](#4-autenticação-e-autorização)
5. [DTOs e Validação](#5-dtos-e-validação)
6. [Serviços e Métodos](#6-serviços-e-métodos)
7. [Status de Implementação](#7-status-de-implementação)
8. [Pontos de Atenção / Melhorias](#8-pontos-de-atenção--melhorias)

---

## 1. Estrutura do Projeto

```
grupo04-cjr-back/
├── .env                          # DATABASE_URL (Neon PostgreSQL) + PORT=3001
├── prisma/
│   ├── schema.prisma             # Schema com 12 modelos
│   └── migrations/               # 4 migrações (init, password_reset, cascade, carrinho)
├── src/
│   ├── main.ts                   # Bootstrap: CORS + static assets (./uploads)
│   ├── app.module.ts             # Módulo raiz (importa 8 módulos)
│   ├── app.controller.ts         # GET / → "Hello World!"
│   ├── app.service.ts            # Métodos auxiliares
│   ├── prisma.module.ts          # Provider global do PrismaService
│   ├── prisma.service.ts         # Extende PrismaClient
│   │
│   ├── auth/                     # Autenticação
│   │   ├── auth.module.ts        # JwtModule (secret, 1d)
│   │   ├── auth.controller.ts    # /auth/*
│   │   ├── auth.service.ts       # login, forgotPassword, resetPassword
│   │   ├── auth.guard.ts         # Guard JWT Bearer
│   │   └── dto/                  # login, forgot-password, reset-password
│   │
│   ├── user/                     # Usuários
│   │   ├── user.module.ts
│   │   ├── user.controller.ts    # /user/*
│   │   ├── user.service.ts       # register, findOne, update, remove
│   │   └── dto/                  # create-user, update-user
│   │
│   ├── produtos/                 # Produtos
│   │   ├── produtos.module.ts
│   │   ├── produtos.controller.ts  # /produtos/*
│   │   ├── produtos.service.ts     # CRUD + salvarImagem
│   │   └── dto/                    # create-produto, update-produto
│   │
│   ├── lojas/                    # Lojas
│   │   ├── lojas.module.ts
│   │   ├── lojas.controller.ts   # /lojas/*
│   │   ├── lojas.service.ts      # CRUD + avg rating
│   │   └── dto/                  # create-loja, update-loja
│   │
│   ├── category/                 # Categorias
│   │   ├── category.module.ts
│   │   ├── category.controller.ts  # /category/*
│   │   ├── category.service.ts     # CRUD com subcategorias
│   │   └── dto/                    # create-category, update-category
│   │
│   ├── carrinho/                 # Carrinho
│   │   ├── carrinho.module.ts
│   │   ├── carrinho.controller.ts  # /carrinho/*
│   │   └── carrinho.service.ts     # get/add/update/remove + finalizarCompra
│   │
│   ├── aval-produto/             # Avaliações de Produto
│   │   ├── aval-produto.module.ts
│   │   ├── aval-produto.controller.ts  # /aval-produto/*
│   │   ├── aval-produto.service.ts     # CRUD + add/update comment
│   │   └── dto/                       # create-aval-produto, update-aval-produto
│   │
│   ├── aval-loja/                # Avaliações de Loja
│   │   ├── aval-loja.module.ts
│   │   ├── aval-loja.controller.ts    # /aval-loja/*
│   │   ├── aval-loja.service.ts       # CRUD by lojaId
│   │   └── dto/                       # create-aval-loja, update-aval-loja
│   │
│   └── coment-aval/              # Comentários de Avaliação
│       ├── coment-aval.module.ts
│       ├── coment-aval.controller.ts  # /coment-aval/*
│       ├── coment-aval.service.ts     # CRUD comments (produto ou loja)
│       └── dto/                       # create-coment-aval, update-coment-aval
│
├── uploads/                      # Uploads locais
├── test/                         # Testes e2e
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
└── dist/                         # Compilado
```

---

## 2. Modelos do Banco (Prisma)

| # | Tabela | Campos Principais | Observações |
|---|--------|-------------------|-------------|
| 1 | **usuarios** | `id` (PK), `username` (uniq), `email` (uniq), `senha_hash`, `nome`, `foto_perfil_url?`, `created_at`, `updated_at` | |
| 2 | **lojas** | `id` (PK), `id_dono` (FK → usuarios), `nome`, `descricao?`, `banner_url?`, `logo_url?`, `foto_url?` | CASCADE com usuário |
| 3 | **categorias** | `id` (PK), `id_cat_pai?` (self-FK), `icone_url?`, `nome` | Auto-relacionamento (subcategorias) |
| 4 | **produtos** | `id` (PK), `nome`, `id_loja` (FK → lojas), `id_categoria?` (FK → categorias), `descricao`, `preco` (Float), `estoque` (Int) | |
| 5 | **avaliacao_produto** | `id` (PK), `id_produto` (FK → produtos), `id_usuario` (FK → usuarios), `nota` (Int 1-5), `comentario?` | |
| 6 | **avaliacao_loja** | `id` (PK), `id_loja` (FK → lojas), `id_usuario` (FK → usuarios), `nota` (Int 1-5), `comentario?` | |
| 7 | **comentario_avaliacao** | `id` (PK), `id_avaliacao_produto?` (FK), `id_avaliacao_loja?` (FK), `id_usuario` (FK → usuarios), `comentario` | Comentários em avaliações |
| 8 | **imagem_produto** | `id` (PK), `id_produto` (FK → produtos), `url_imagem`, `ordem` (Int) | Imagens ordenadas do produto |
| 9 | **PasswordReset** | `id` (PK), `email`, `token` (uniq), `expiresAt`, `createdAt` | Reset de senha |
| 10 | **ItemCarrinho** | `id` (PK), `usuario_id` (FK → usuarios), `produto_id` (FK → produtos), `quantidade` (Int) | CASCADE |
| 11 | **Pedido** | `id` (PK), `usuario_id` (FK → usuarios), `total` (Float), `created_at` | CASCADE |
| 12 | **ItemPedido** | `id` (PK), `pedido_id` (FK → Pedido), `produto_id` (FK → produtos), `quantidade` (Int), `preco_pago` (Float) | CASCADE |

### Relacionamentos Chave

- `lojas` → `usuarios` (id_dono): **CASCADE**
- `produtos` → `lojas`: **RESTRICT**
- `produtos` → `categorias`: **SET NULL**
- `categorias` self-FK (id_cat_pai): **SET NULL**
- `avaliacao_produto` → `produtos`/`usuarios`: **RESTRICT**
- `avaliacao_loja` → `lojas`/`usuarios`: **RESTRICT**
- `comentario_avaliacao` → avaliações: **SET NULL**
- `ItemCarrinho`, `Pedido`, `ItemPedido`: **CASCADE**

---

## 3. Módulos e Endpoints

### Auth (`/auth`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/login` | ❌ | Login (email + password) → `{ access_token }` |
| POST | `/auth/forgot-password` | ❌ | Solicitar reset → retorna token (para testes) |
| POST | `/auth/reset-password` | ❌ | Resetar senha com token |

### User (`/user`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/user/register` | ❌ | Registrar (name, username, email, password) |
| GET | `/user/:id` | ❌ | Perfil com lojas, produtos, avaliações |
| PATCH | `/user/:id` | ✅ | Atualizar (multipart para foto) |
| DELETE | `/user/:id` | ✅ | Excluir conta |

### Produtos (`/produtos`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/produtos` | ✅ | Criar produto |
| GET | `/produtos` | ❌ | Listar (opcional `?busca=`) |
| GET | `/produtos/:id` | ❌ | Detalhe (categoria, imagens, loja) |
| PATCH | `/produtos/:id` | ✅ | Atualizar |
| DELETE | `/produtos/:id` | ✅ | Excluir |
| POST | `/produtos/:id/imagens` | ✅ | Upload imagem (multipart, field: `arquivos`) |

### Lojas (`/lojas`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/lojas` | ❌ | Criar loja |
| GET | `/lojas` | ❌ | Listar todas |
| GET | `/lojas/:id` | ❌ | Detalhe (produtos, imagens, média avaliações) |
| PATCH | `/lojas/:id` | ❌ | Atualizar |
| DELETE | `/lojas/:id` | ❌ | Excluir |

### Category (`/category`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/category` | ✅ | Criar categoria |
| GET | `/category` | ❌ | Listar raízes (com subcategorias) |
| GET | `/category/:id` | ❌ | Detalhe (subcategorias + pai) |
| PATCH | `/category/:id` | ✅ | Atualizar |
| DELETE | `/category/:id` | ✅ | Excluir |

### Carrinho (`/carrinho`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/carrinho` | ❌* | Itens do carrinho (produto + imagem) |
| POST | `/carrinho` | ❌* | Adicionar ou atualizar quantidade |
| PATCH | `/carrinho/:id` | ❌* | Atualizar quantidade |
| DELETE | `/carrinho/:id` | ❌* | Remover item |
| POST | `/carrinho/finalizar` | ❌* | Finalizar compra (Pedido + ItemPedido) |

*\* Usa MOCK_USER_ID = 1 hardcoded.*

### Avaliação de Produto (`/aval-produto`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/aval-produto/:produtoId` | ✅ | Criar avaliação (nota 1-5 + comentário) |
| GET | `/aval-produto/produto/:produtoId` | ❌ | Listar avaliações do produto |
| GET | `/aval-produto/:id` | ❌ | Detalhe (comentários com isDonoLoja) |
| PATCH | `/aval-produto/:id` | ✅ | Editar própria avaliação |
| DELETE | `/aval-produto/:id` | ✅ | Excluir própria avaliação |
| POST | `/aval-produto/:id/comentario` | ✅ | Adicionar comentário |
| PATCH | `/aval-produto/comentario/:comentarioId` | ✅ | Editar próprio comentário |

### Avaliação de Loja (`/aval-loja`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/aval-loja/:lojaId` | ✅ | Criar avaliação |
| GET | `/aval-loja/loja/:lojaId` | ❌ | Listar avaliações da loja |
| PATCH | `/aval-loja/:id` | ✅ | Editar própria |
| DELETE | `/aval-loja/:id` | ✅ | Excluir própria |

### Comentários de Avaliação (`/coment-aval`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/coment-aval` | ✅ | Criar (em avaliação de produto ou loja) |
| GET | `/coment-aval/produto/:id` | ❌ | Listar de avaliação de produto |
| GET | `/coment-aval/loja/:id` | ❌ | Listar de avaliação de loja |
| PATCH | `/coment-aval/:id` | ✅ | Editar próprio |
| DELETE | `/coment-aval/:id` | ✅ | Excluir próprio |

---

## 4. Autenticação e Autorização

| Aspecto | Detalhe |
|---------|---------|
| **Tipo** | JWT (HS256) |
| **Secret** | `'chave_secreta_super_segura_cjr'` (hardcoded em `auth.module.ts` e `auth.guard.ts`) |
| **Expiração** | 1 dia (`expiresIn: '1d'`) |
| **Payload** | `{ sub: user.id, email: user.email }` |
| **Header** | `Authorization: Bearer <token>` |
| **Guard** | `AuthGuard` — verifica token, anexa `request.user` |
| **Protegidos** | POST/PATCH/DELETE de produtos, categorias, user (update/delete), avaliações, comentários |
| **Verificação de dono** | AvalProdutoService, AvalLojaService, ComentAvalService checam `userId === record.id_usuario` |
| **Senha** | bcrypt com salt rounds = 10 |
| **Reset de senha** | Token 6 caracteres hex, expira em 1h, salvo na tabela `PasswordReset` |
| **Não protegidos** | Carrinho (mock user id=1), Lojas CRUD, User register/findOne |

---

## 5. DTOs e Validação

| DTO | Campos | Validações |
|-----|--------|-----------|
| `LoginDto` | email, password | `@IsEmail`, `@IsNotEmpty` |
| `ForgotPasswordDto` | email | `@IsEmail`, `@IsNotEmpty` |
| `ResetPasswordDto` | token, newPassword | `@IsNotEmpty`, `@MinLength(6)` |
| `CreateUserDto` | name, username, email, password | `@IsString`, `@IsEmail`, `@MinLength(6)`, `@IsNotEmpty` |
| `UpdateUserDto` | PartialType de CreateUserDto | (herdado) |
| `CreateProdutoDto` | nome, descricao, preco, estoque, id_loja, id_categoria | `@IsString`, `@IsNumber`, `@IsNotEmpty` |
| `CreateLojaDto` | (vazio) | ⚠️ **Nenhuma validação** |
| `CreateCategoryDto` | nome, icone_url, id_cat_pai? | `@IsString`, `@IsNotEmpty`, `@IsOptional`, `@IsInt` |
| `CreateAvalProdutoDto` | nota (1-5), comentario? | `@Min(1)`, `@Max(5)`, `@IsNotEmpty` |
| `CreateAvalLojaDto` | nota (1-5), comentario? | `@Min(1)`, `@Max(5)`, `@IsNotEmpty` |
| `CreateComentAvalDto` | comentario, id_avaliacao_produto?, id_avaliacao_loja? | `@IsString`, `@IsNotEmpty`, `@IsOptional`, `@IsInt` |

---

## 6. Serviços e Métodos

| Serviço | Método | Descrição |
|---------|--------|-----------|
| **AuthService** | `login(dto)` | Valida credenciais, retorna JWT |
| | `forgotPassword(dto)` | Cria token de reset (retorna para testes) |
| | `resetPassword(dto)` | Valida token, atualiza senha |
| **UserService** | `register(dto)` | Cria usuário com senha hash, checa duplicatas |
| | `findOne(id)` | Perfil com lojas, produtos, avaliações |
| | `update(id, dto)` | Atualiza dados + senha (com verificação da antiga) |
| | `remove(id)` | Exclui usuário |
| **ProdutosService** | `create(dto)` | Cria produto |
| | `findAll(busca?)` | Lista com busca opcional por nome |
| | `findOne(id)` | Detalhe com categoria, imagens, loja |
| | `update(id, dto)` | Atualiza |
| | `remove(id)` | Exclui |
| | `salvarImagem(idProduto, url, ordem)` | Salva registro de imagem |
| **LojasService** | `create(dados)` | Cria loja |
| | `findAll()` | Lista todas |
| | `findOne(id)` | Detalhe com produtos, imagens, média avaliações |
| | `update(id, dados)` | Atualiza |
| | `remove(id)` | Exclui |
| **CategoryService** | `create(dto)` | Cria categoria |
| | `findAll()` | Lista raízes (id_cat_pai null) com subcategorias |
| | `findOne(id)` | Detalhe com subcategorias e pai |
| | `update(id, dto)` | Atualiza |
| | `remove(id)` | Exclui |
| **CarrinhoService** | `getCarrinho(usuarioId)` | Itens com detalhes do produto |
| | `adicionarOuAtualizar(usuarioId, produtoId, qtd)` | Adiciona ou incrementa |
| | `atualizarQuantidade(itemId, qtd)` | Atualiza (remove se ≤ 0) |
| | `removerItem(itemId)` | Remove item |
| | `finalizarCompra(usuarioId)` | Transação: cria Pedido + ItemPedido, limpa carrinho |
| **AvalProdutoService** | `create(dto, userId, produtoId)` | Cria avaliação |
| | `findAllByProduct(produtoId)` | Lista com dados do usuário |
| | `findOne(id)` | Detalhe com comentários e flag isDonoLoja |
| | `update(id, userId, dto)` | Atualiza própria |
| | `remove(id, userId)` | Exclui própria |
| | `addComment(idAvaliacao, userId, texto)` | Adiciona comentário |
| | `updateComment(idComentario, userId, texto)` | Atualiza próprio comentário |
| **AvalLojaService** | `create(dto, userId, lojaId)` | Cria avaliação |
| | `findOne(id)` | Detalhe |
| | `findAllByLoja(lojaId)` | Lista com nome do usuário |
| | `update(id, userId, dto)` | Atualiza própria |
| | `remove(id, userId)` | Exclui própria |
| **ComentAvalService** | `create(dto, userId)` | Cria comentário (produto ou loja) |
| | `findAllByProduto(id)` | Lista com nome do usuário |
| | `findAllByLoja(id)` | Lista com nome do usuário |
| | `findOne(id)` | Detalhe |
| | `update(id, userId, dto)` | Atualiza próprio |
| | `remove(id, userId)` | Exclui próprio |

---

## 7. Status de Implementação

### Funcionalidades Completas

- [x] Registro de usuário (com hash de senha, checagem de duplicatas)
- [x] Perfil de usuário (leitura com lojas/produtos/avaliações)
- [x] Atualização de usuário (com upload de foto e alteração de senha)
- [x] Exclusão de usuário
- [x] Login JWT
- [x] Reset de senha (forgot + reset com token)
- [x] Guard de autenticação
- [x] CRUD de produtos (com busca por nome)
- [x] Upload de imagens de produto (múltiplas, ordenadas)
- [x] CRUD de lojas (com cálculo de média de avaliações)
- [x] CRUD de categorias (com hierarquia de subcategorias)
- [x] Carrinho (adicionar, atualizar, remover)
- [x] Finalizar compra (checkout transaction: Pedido + ItemPedido)
- [x] CRUD de avaliações de produto (com verificação de dono)
- [x] CRUD de avaliações de loja (com verificação de dono)
- [x] Comentários em avaliações de produto (com flag isDonoLoja)
- [x] Comentários em avaliações de loja
- [x] Upload de arquivos (multer, armazenamento local)

### Pendentes / Melhorias

- [ ] **ValidationPipe global** não configurado em `main.ts` — validações DTO podem não estar ativas
- [ ] **Carrinho sem autenticação real** — usa `MOCK_USER_ID = 1` hardcoded
- [ ] **Lojas sem AuthGuard** — CRUD de lojas não protegido por JWT
- [ ] **CreateLojaDto vazio** — sem validação de campos
- [ ] **Entidades TypeScript vazias** — todos os `*.entity.ts` são stubs sem campos
- [ ] **Consistência de respostas** — alguns endpoints retornam `{ message }`, outros retornam o objeto direto
- [ ] **Testes** — apenas 1 e2e test (Hello World), sem testes unitários
- [ ] **Forgot password retorna token** — intencional para testes, mas inseguro para produção
- [ ] **Secret JWT hardcoded** — deveria estar em variável de ambiente
- [ ] **Upload local** — sem CDN/storage externo (S3, Cloudinary, etc.)
- [ ] **Filtro por categoria em produtos** — `GET /produtos` não aceita filtro por `id_categoria`

---

## 8. Pontos de Atenção / Melhorias

### 🔴 Críticos

1. **Carrinho usa usuário mockado** → impedimento para multiusuário real. Precisa integrar `AuthGuard` e usar `req.user.sub`
2. **ValidationPipe não configurado** → DTOs com `class-validator` podem não estar validando nada
3. **Secret JWT exposta no código** → mover para `.env`

### 🟡 Importantes

4. **Lojas sem proteção** → qualquer um pode criar/editar/deletar qualquer loja
5. **Forgot password retorna token** → em produção, deveria enviar por email
6. **Sem filtro de categoria em produtos** → frontend precisa filtrar manualmente
7. **Entidades vazias** → sem tipagem adequada nos controllers

### 🟢 Desejáveis

8. **Testes automatizados** — zero cobertura atual
9. **Consistência de response** — padronizar formato das respostas
10. **Upload para cloud** — storage local não escala
11. **Logging estruturado** — usar logger do NestJS consistentemente
12. **Swagger/OpenAPI** — documentação automática dos endpoints
