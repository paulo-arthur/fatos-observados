import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export function validateLoginInput(email: string, senha: string) {
  const result = loginSchema.safeParse({ email, senha });
  if (result.success) return { data: result.data, errors: {} };

  const errors: { email?: string; senha?: string } = {};
  for (const issue of result.error.issues) {
    if (issue.path[0] === 'email' && !errors.email) errors.email = issue.message;
    if (issue.path[0] === 'senha' && !errors.senha) errors.senha = issue.message;
  }
  return { data: null, errors };
}
