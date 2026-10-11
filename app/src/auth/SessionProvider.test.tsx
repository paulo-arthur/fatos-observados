import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { loginRequest, setUnauthorizedHandler } from '../api/client';
import { SessionProvider, useSession } from './SessionProvider';
import { clearSession, readSession, saveSession } from './storage';
import type { Session } from './types';

jest.mock('../api/client', () => ({
  loginRequest: jest.fn(),
  setUnauthorizedHandler: jest.fn(),
}));
jest.mock('./storage', () => ({
  readSession: jest.fn(),
  saveSession: jest.fn(),
  clearSession: jest.fn(),
}));

const session: Session = {
  token: 'token-teste',
  usuario: { id: 'u1', nome: 'Tenente Teste', email: 'tenente@mil.br', perfil: 'TENENTE' },
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(readSession).mockResolvedValue(null);
  jest.mocked(saveSession).mockResolvedValue(undefined);
  jest.mocked(clearSession).mockResolvedValue(undefined);
});

async function setup() {
  const queryClient = new QueryClient();
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <SessionProvider>{children}</SessionProvider>
      </QueryClientProvider>
    );
  }
  return { queryClient, ...(await renderHook(() => useSession(), { wrapper: Wrapper })) };
}

it('restaura o usuário salvo quando o app abre', async () => {
  jest.mocked(readSession).mockResolvedValue(session);
  const { result } = await setup();
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.session).toEqual(session);
});

it('salva o resultado da API no SecureStore antes de entrar', async () => {
  jest.mocked(loginRequest).mockResolvedValue(session);
  const { result } = await setup();
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  await act(async () => {
    await result.current.signIn({ email: 'tenente@mil.br', senha: 'senha123' });
  });

  expect(saveSession).toHaveBeenCalledWith(session);
  expect(result.current.session).toEqual(session);
});

it('apaga SecureStore e todo o cache do TanStack Query no logout', async () => {
  jest.mocked(readSession).mockResolvedValue(session);
  const { result, queryClient } = await setup();
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  queryClient.setQueryData(['dados-privados'], { nome: 'Sigiloso' });

  await act(async () => {
    await result.current.signOut();
  });

  expect(clearSession).toHaveBeenCalledTimes(1);
  expect(queryClient.getQueryData(['dados-privados'])).toBeUndefined();
  expect(result.current.session).toBeNull();
  expect(setUnauthorizedHandler).toHaveBeenCalled();
});
