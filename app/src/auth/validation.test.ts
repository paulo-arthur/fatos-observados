import { validateLoginInput } from './validation';

describe('validação do login', () => {
  it('rejeita e-mail inválido e senha curta antes de chamar a API', () => {
    const result = validateLoginInput('sem-arroba', '12345');
    expect(result.data).toBeNull();
    expect(result.errors).toEqual({
      email: 'E-mail inválido',
      senha: 'A senha deve ter pelo menos 6 caracteres.',
    });
  });

  it('aceita credenciais dentro do contrato da API', () => {
    const result = validateLoginInput('aluno@mil.br', 'senha123');
    expect(result.data).toEqual({ email: 'aluno@mil.br', senha: 'senha123' });
    expect(result.errors).toEqual({});
  });
});
