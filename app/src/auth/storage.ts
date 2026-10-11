import * as SecureStore from 'expo-secure-store';
import { z } from 'zod';

import type { Session } from './types';

const STORAGE_KEY = 'fo.session';

const sessionSchema = z.object({
  token: z.string().min(1),
  usuario: z.object({
    id: z.string().min(1),
    nome: z.string(),
    email: z.email(),
    perfil: z.enum(['ALUNO', 'TENENTE', 'CAPITAO']),
  }),
});

export async function readSession(): Promise<Session | null> {
  const value = await SecureStore.getItemAsync(STORAGE_KEY);
  if (!value) return null;

  try {
    const parsed = sessionSchema.safeParse(JSON.parse(value));
    if (parsed.success) return parsed.data;
  } catch {
    // A damaged value must never be treated as an authenticated session.
  }

  await clearSession();
  return null;
}

export async function saveSession(session: Session): Promise<void> {
  const parsed = sessionSchema.parse(session);
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(parsed));
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}
