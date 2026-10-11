-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('ALUNO', 'TENENTE', 'CAPITAO');

-- CreateEnum
CREATE TYPE "StatusFato" AS ENUM ('PENDENTE', 'JULGADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fatos_observados" (
    "id" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "status" "StatusFato" NOT NULL DEFAULT 'PENDENTE',
    "data" DATE NOT NULL,
    "hora" TIME(0) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "alunoId" TEXT NOT NULL,
    "oficialId" TEXT NOT NULL,

    CONSTRAINT "fatos_observados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "fatos_observados_alunoId_idx" ON "fatos_observados"("alunoId");

-- CreateIndex
CREATE INDEX "fatos_observados_oficialId_idx" ON "fatos_observados"("oficialId");

-- AddForeignKey
ALTER TABLE "fatos_observados" ADD CONSTRAINT "fatos_observados_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fatos_observados" ADD CONSTRAINT "fatos_observados_oficialId_fkey" FOREIGN KEY ("oficialId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
