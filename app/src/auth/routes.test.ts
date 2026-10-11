import { canAccessInstructor, homeRouteForProfile } from './routes';

describe('rotas por perfil', () => {
  it.each([
    ['ALUNO', '/(aluno)/tabela'],
    ['TENENTE', '/(instrutor)/registrar'],
    ['CAPITAO', '/(capitao)/hora-do-pato'],
  ] as const)('%s entra em %s', (perfil, rota) => {
    expect(homeRouteForProfile(perfil)).toBe(rota);
  });

  it('libera a área do instrutor para tenente e capitão', () => {
    expect(canAccessInstructor('ALUNO')).toBe(false);
    expect(canAccessInstructor('TENENTE')).toBe(true);
    expect(canAccessInstructor('CAPITAO')).toBe(true);
    expect(canAccessInstructor(undefined)).toBe(false);
  });
});
