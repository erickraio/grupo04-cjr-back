-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "foto_perfil_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lojas" (
    "id" SERIAL NOT NULL,
    "id_dono" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "banner_url" TEXT,
    "logo_url" TEXT,
    "foto_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lojas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "id_cat_pai" INTEGER NOT NULL,
    "icone_url" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "id_loja" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "estoque" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacao_produto" (
    "id" SERIAL NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacao_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacao_loja" (
    "id" SERIAL NOT NULL,
    "id_loja" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacao_loja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentario_avaliacao" (
    "id" SERIAL NOT NULL,
    "id_avaliacao_produto" INTEGER,
    "id_avaliacao_loja" INTEGER,
    "id_usuario" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comentario_avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagem_produto" (
    "id" SERIAL NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "url_imagem" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "imagem_produto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "lojas" ADD CONSTRAINT "lojas_id_dono_fkey" FOREIGN KEY ("id_dono") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_id_loja_fkey" FOREIGN KEY ("id_loja") REFERENCES "lojas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_produto" ADD CONSTRAINT "avaliacao_produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_produto" ADD CONSTRAINT "avaliacao_produto_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_loja" ADD CONSTRAINT "avaliacao_loja_id_loja_fkey" FOREIGN KEY ("id_loja") REFERENCES "lojas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_loja" ADD CONSTRAINT "avaliacao_loja_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_avaliacao" ADD CONSTRAINT "comentario_avaliacao_id_avaliacao_produto_fkey" FOREIGN KEY ("id_avaliacao_produto") REFERENCES "avaliacao_produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_avaliacao" ADD CONSTRAINT "comentario_avaliacao_id_avaliacao_loja_fkey" FOREIGN KEY ("id_avaliacao_loja") REFERENCES "avaliacao_loja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_avaliacao" ADD CONSTRAINT "comentario_avaliacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagem_produto" ADD CONSTRAINT "imagem_produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
