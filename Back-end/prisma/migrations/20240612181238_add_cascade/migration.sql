-- DropForeignKey
ALTER TABLE "subLista" DROP CONSTRAINT "subLista_listaId_fkey";

-- AddForeignKey
ALTER TABLE "subLista" ADD CONSTRAINT "subLista_listaId_fkey" FOREIGN KEY ("listaId") REFERENCES "Lista"("id") ON DELETE CASCADE ON UPDATE CASCADE;
