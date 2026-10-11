import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, Perfil } from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

if (process.env.NODE_ENV === "production") {
  throw new Error("O seed de desenvolvimento não pode ser executado em produção.");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não configurado.");
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// Credencial exclusivamente para o ambiente de desenvolvimento.
const testPassword = "SenhaTeste123!";

const users = [
  { nome: "Aluno de Teste", email: "aluno.teste@example.com", perfil: Perfil.ALUNO },
  { nome: "Tenente de Teste", email: "tenente.teste@example.com", perfil: Perfil.TENENTE },
  { nome: "Capitão de Teste", email: "capitao.teste@example.com", perfil: Perfil.CAPITAO },
];

try {
  const senhaHash = await bcrypt.hash(testPassword, 10);
  for (const user of users) {
    await prisma.usuario.upsert({
      where: { email: user.email },
      create: { ...user, senhaHash },
      update: { nome: user.nome, perfil: user.perfil, ativo: true, senhaHash },
    });
  }
  console.log("Usuários de desenvolvimento criados ou atualizados.");
} finally {
  await prisma.$disconnect();
  await pool.end();
}
