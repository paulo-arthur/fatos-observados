import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import { ApiError } from '../api/client';
import LoginScreen from '../app/(auth)/login';
import { useSession } from './SessionProvider';

jest.mock('./SessionProvider', () => ({ useSession: jest.fn() }));

let signIn: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  signIn = jest.fn();
  jest.mocked(useSession).mockReturnValue({
    session: null,
    isLoading: false,
    signIn,
    signOut: jest.fn(),
  });
});

it('valida os campos sem enviar credenciais inválidas', async () => {
  const screen = await render(<LoginScreen />);
  await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  expect(screen.getByText('E-mail inválido')).toBeTruthy();
  expect(screen.getByText('A senha deve ter pelo menos 6 caracteres.')).toBeTruthy();
  expect(signIn).not.toHaveBeenCalled();
});

it('mostra 401 sem apagar os dados digitados', async () => {
  signIn.mockRejectedValue(new ApiError('http', 'Credenciais inválidas', 401));
  const screen = await render(<LoginScreen />);
  await fireEvent.changeText(screen.getByLabelText('E-mail'), 'aluno@mil.br');
  await fireEvent.changeText(screen.getByLabelText('Senha'), 'senha123');
  await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

  await waitFor(() => expect(screen.getByText('Credenciais inválidas')).toBeTruthy());
  expect(screen.getByLabelText('E-mail').props.value).toBe('aluno@mil.br');
  expect(screen.getByLabelText('Senha').props.value).toBe('senha123');
});

it('chama a sessão uma vez e bloqueia toque duplo durante o login', async () => {
  let resolveLogin!: () => void;
  signIn.mockReturnValue(new Promise<void>((resolve) => { resolveLogin = resolve; }));
  const screen = await render(<LoginScreen />);
  await fireEvent.changeText(screen.getByLabelText('E-mail'), 'aluno@mil.br');
  await fireEvent.changeText(screen.getByLabelText('Senha'), 'senha123');
  await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
  expect(signIn).toHaveBeenCalledTimes(1);
  expect(screen.getByText('Entrando...')).toBeTruthy();
  await act(async () => resolveLogin());
  await waitFor(() => expect(screen.getByRole('button', { name: 'Entrar' }).props.accessibilityState.disabled).toBe(false));
});
