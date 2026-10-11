import { Router } from "express";
import bcrypt from "bcrypt";
import type { Perfil } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { signLoginToken } from "../lib/jwt.js";

const loginSchema = z.object({
  email: z.string({ required_error: "E-mail inválido", invalid_type_error: "E-mail inválido" }).email("E-mail inválido"),
  senha: z.string({ required_error: "Senha deve ter no mínimo 6 caracteres", invalid_type_error: "Senha deve ter no mínimo 6 caracteres" }).min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const fakeHash = bcrypt.hashSync("senha-falsa-de-comparação", 10);

export type LoginUser = {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  perfil: Perfil;
  ativo: boolean;
};

export type AuthDependencies = {
  findUserByEmail(email: string): Promise<LoginUser | null>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  createToken(user: { id: string; perfil: Perfil }): string;
  reportError(error: unknown): void;
};

export function createAuthRouter(deps: AuthDependencies): Router {
  const router = Router();

  router.post("/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const field = parsed.error.issues[0].path[0];
      const message = field === "email"
        ? "E-mail inválido"
        : field === "senha"
          ? "Senha deve ter no mínimo 6 caracteres"
          : "Dados de login inválidos";
      return res.status(400).json({ error: message });
    }

    try {
      const { email, senha } = parsed.data;
      const user = await deps.findUserByEmail(email);
      // Faça a comparação mesmo quando o e-mail não existe, para reduzir
      // a diferença de tempo entre usuários existentes e inexistentes.
      const passwordMatches = await deps.comparePassword(senha, user?.senhaHash ?? fakeHash);

      if (!user || !user.ativo || !passwordMatches) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = deps.createToken({ id: user.id, perfil: user.perfil });
      return res.status(200).json({
        token,
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          perfil: user.perfil,
        },
      });
    } catch (error) {
      deps.reportError(error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  return router;
}

export const authRouter = createAuthRouter({
  findUserByEmail: (email) => prisma.usuario.findUnique({
    where: { email },
    select: { id: true, nome: true, email: true, senhaHash: true, perfil: true, ativo: true },
  }),
  comparePassword: (password, hash) => bcrypt.compare(password, hash),
  createToken: signLoginToken,
  reportError: (error) => console.error("Erro ao autenticar usuário:", error),
});
