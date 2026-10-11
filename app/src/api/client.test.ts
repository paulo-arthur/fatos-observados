import { readSession } from '../auth/storage';
import type { Session } from '../auth/types';
import { ApiError, apiRequest, loginRequest, setUnauthorizedHandler } from './client';

jest.mock('../auth/storage', () => ({ readSession: jest.fn() }));

const session: Session = {
  token: 'token-teste',
  usuario: { id: 'u1', nome: 'Capitão Teste', email: 'capitao@mil.br', perfil: 'CAPITAO' },
};
const originalFetch = globalThis.fetch;
let fetchMock: jest.Mock;

function response(status: number, payload: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  } as Response;
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.EXPO_PUBLIC_API_URL = 'http://192.168.1.10:3333/';
  fetchMock = jest.fn();
  globalThis.fetch = fetchMock as typeof fetch;
  setUnauthorizedHandler(null);
});

afterAll(() => {
  globalThis.fetch = originalFetch;
});

it('faz login público pelo contrato e devolve token + perfil', async () => {
  fetchMock.mockResolvedValue(response(200, session));
  await expect(loginRequest({ email: 'capitao@mil.br', senha: 'senha123' })).resolves.toEqual(session);
  expect(fetchMock).toHaveBeenCalledWith(
    'http://192.168.1.10:3333/auth/login',
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email: 'capitao@mil.br', senha: 'senha123' }),
      headers: expect.not.objectContaining({ Authorization: expect.anything() }),
    }),
  );
});

it('repassa o erro 400 da API e usa resposta genérica para 401', async () => {
  fetchMock.mockResolvedValueOnce(response(400, { error: 'E-mail inválido' }));
  await expect(loginRequest({ email: 'ruim', senha: 'senha123' })).rejects.toMatchObject({
    status: 400,
    message: 'E-mail inválido',
  });
  fetchMock.mockResolvedValueOnce(response(401, { error: 'detalhe que não deve aparecer' }));
  await expect(loginRequest({ email: 'aluno@mil.br', senha: 'senha123' })).rejects.toMatchObject({
    status: 401,
    message: 'Credenciais inválidas',
  });
});

it('envia o token e encerra a sessão ao receber 401 numa rota protegida', async () => {
  jest.mocked(readSession).mockResolvedValue(session);
  const onUnauthorized = jest.fn().mockResolvedValue(undefined);
  setUnauthorizedHandler(onUnauthorized);
  fetchMock.mockResolvedValue(response(401, { error: 'Credenciais inválidas' }));

  await expect(apiRequest('/fatos')).rejects.toBeInstanceOf(ApiError);
  expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer token-teste');
  expect(onUnauthorized).toHaveBeenCalledTimes(1);
});

it('distingue ausência de rede de erro do servidor', async () => {
  fetchMock.mockRejectedValue(new TypeError('Network request failed'));
  await expect(loginRequest({ email: 'aluno@mil.br', senha: 'senha123' })).rejects.toMatchObject({
    kind: 'network',
  });
});
