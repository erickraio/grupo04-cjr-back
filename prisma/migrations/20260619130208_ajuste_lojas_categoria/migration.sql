-- DropForeignKey
ALTER TABLE "avaliacao_produto" DROP CONSTRAINT "avaliacao_produto_id_produto_fkey";

-- DropForeignKey
ALTER TABLE "imagem_produto" DROP CONSTRAINT "imagem_produto_id_produto_fkey";

-- AddForeignKey
ALTER TABLE "avaliacao_produto" ADD CONSTRAINT "avaliacao_produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagem_produto" ADD CONSTRAINT "imagem_produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
