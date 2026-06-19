-- This migration was already applied to the database
-- It adds id_categoria column and foreign key to lojas table

ALTER TABLE "lojas" ADD COLUMN "id_categoria" INTEGER;
ALTER TABLE "lojas" ADD CONSTRAINT "lojas_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
