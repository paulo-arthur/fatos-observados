import jwt from "jsonwebtoken";
import type { Perfil } from "@prisma/client";

export function assertJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || !secret.trim()) {
    throw new Error("JWT_SECRET não configurado. Defina a variável antes de iniciar a API.");
  }

  return secret;
}

export function signLoginToken(user: { id: string; perfil: Perfil }): string {
  return jwt.sign(
    { sub: user.id, perfil: user.perfil },
    assertJwtSecret(),
    { algorithm: "HS256", expiresIn: "7d" },
  );
}
