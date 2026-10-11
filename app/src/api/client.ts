import { z } from 'zod';

import { readSession } from '../auth/storage';
import type { Session } from '../auth/types';
import type { LoginInput } from '../auth/validation';

const LOGIN_TIMEOUT_MS = 30_000;
const SLOW_NOTICE_MS = 5_000;

const loginResponseSchema = z.object({
  token: z.string().min(1),
  usuario: z.object({
    id: z.string().min(1),
    nome: z.string(),
    email: z.email(),
    perfil: z.enum(['ALUNO', 'TENENTE', 'CAPITAO']),
  }),
});

export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'configuration' | 'auth';

export class ApiError extends Error {
  constructor(
    public readonly kind: ApiErrorKind,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  authenticated?: boolean;
  timeoutMs?: number;
};

let unauthorizedHandler: (() => Promise<void>) | null = null;

export function setUnauthorizedHandler(handler: (() => Promise<void>) | null) {
  unauthorizedHandler = handler;
}

function apiBaseUrl(): string {
  const value = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');
  if (!value || !/^https?:\/\//i.test(value)) {
    throw new ApiError('configuration', 'Endereço da API não configurado.');
  }
  return value;
}

function apiMessage(value: unknown): string | undefined {
  if (!value || typeof value !== 'object' || !('error' in value)) return undefined;
  return typeof value.error === 'string' ? value.error : undefined;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = apiBaseUrl();
  const authenticated = options.authenticated !== false;
  const session = authenticated ? await readSession() : null;
  if (authenticated && !session) {
    await unauthorizedHandler?.();
    throw new ApiError('auth', 'Sessão encerrada. Entre novamente.');
  }

  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, options.timeoutMs ?? LOGIN_TIMEOUT_MS);

  let response: Response;
  let payload: unknown;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(session ? { Authorization: `Bearer ${session.token}` } : {}),
      },
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
      signal: controller.signal,
    });
    try {
      payload = await response.json();
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      payload = null;
    }
  } catch {
    throw timedOut
      ? new ApiError('timeout', 'O servidor demorou para responder.')
      : new ApiError('network', 'Sem conexão. Verifique a internet e tente de novo.');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    if (response.status === 401 && authenticated) await unauthorizedHandler?.();
    throw new ApiError(
      'http',
      response.status === 401 ? 'Credenciais inválidas' : apiMessage(payload) ?? 'Erro interno no servidor',
      response.status,
    );
  }

  return payload as T;
}

export async function loginRequest(
  input: LoginInput,
  onSlowConnection?: () => void,
): Promise<Session> {
  const slowNotice = setTimeout(() => onSlowConnection?.(), SLOW_NOTICE_MS);
  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await apiRequest<unknown>('/auth/login', {
          method: 'POST',
          body: input,
          authenticated: false,
          timeoutMs: LOGIN_TIMEOUT_MS,
        });
        const parsed = loginResponseSchema.safeParse(response);
        if (!parsed.success) {
          throw new ApiError('http', 'Resposta inválida do servidor.', 500);
        }
        return parsed.data;
      } catch (error) {
        if (error instanceof ApiError && error.kind === 'timeout' && attempt === 0) {
          onSlowConnection?.();
          continue;
        }
        throw error;
      }
    }
    throw new ApiError('timeout', 'O servidor demorou para responder.');
  } finally {
    clearTimeout(slowNotice);
  }
}
