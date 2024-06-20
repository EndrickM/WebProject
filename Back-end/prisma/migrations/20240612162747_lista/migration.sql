-- CreateTable
CREATE TABLE "Lista" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Lista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subLista" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "listaId" INTEGER NOT NULL,

    CONSTRAINT "subLista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subSub" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "sublistaId" INTEGER NOT NULL,

    CONSTRAINT "subSub_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subLista" ADD CONSTRAINT "subLista_listaId_fkey" FOREIGN KEY ("listaId") REFERENCES "Lista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subSub" ADD CONSTRAINT "subSub_sublistaId_fkey" FOREIGN KEY ("sublistaId") REFERENCES "subLista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
