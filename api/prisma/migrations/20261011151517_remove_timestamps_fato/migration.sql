/*
  Warnings:

  - You are about to drop the column `atualizadoEm` on the `fatos_observados` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `fatos_observados` table. All the data in the column will be lost.
  - You are about to drop the column `atualizadoEm` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "fatos_observados" DROP COLUMN "atualizadoEm",
DROP COLUMN "criadoEm";

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "atualizadoEm",
DROP COLUMN "criadoEm";
