-- DropForeignKey
ALTER TABLE "lojas" DROP CONSTRAINT "lojas_id_dono_fkey";

-- DropForeignKey
ALTER TABLE "produtos" DROP CONSTRAINT "produtos_id_categoria_fkey";

-- AlterTable
ALTER TABLE "categorias" ALTER COLUMN "id_cat_pai" DROP NOT NULL,
ALTER COLUMN "icone_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "produtos" ALTER COLUMN "id_categoria" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "lojas" ADD CONSTRAINT "lojas_id_dono_fkey" FOREIGN KEY ("id_dono") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_id_cat_pai_fkey" FOREIGN KEY ("id_cat_pai") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
