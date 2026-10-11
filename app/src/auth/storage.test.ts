import * as SecureStore from 'expo-secure-store';

import { clearSession, readSession, saveSession } from './storage';
import type { Session } from './types';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const session: Session = {
  token: 'jwt-de-teste',
  usuario: { id: 'u1', nome: 'Aluna Teste', email: 'aluna@mil.br', perfil: 'ALUNO' },
};

beforeEach(() => jest.clearAllMocks());

it('grava token e usuário juntos apenas no SecureStore', async () => {
  await saveSession(session);
  expect(SecureStore.setItemAsync).toHaveBeenCalledWith('fo.session', JSON.stringify(session));
});

it('restaura uma sessão íntegra ao abrir o app', async () => {
  jest.mocked(SecureStore.getItemAsync).mockResolvedValue(JSON.stringify(session));
  await expect(readSession()).resolves.toEqual(session);
});

it('descarta valores danificados em vez de autenticar', async () => {
  jest.mocked(SecureStore.getItemAsync).mockResolvedValue('{invalido');
  await expect(readSession()).resolves.toBeNull();
  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('fo.session');
});

it('remove a sessão do SecureStore no logout', async () => {
  await clearSession();
  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('fo.session');
});
