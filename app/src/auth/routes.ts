import type { Perfil } from './types';

export function homeRouteForProfile(perfil: Perfil) {
  switch (perfil) {
    case 'ALUNO':
      return '/(aluno)/tabela' as const;
    case 'TENENTE':
      return '/(instrutor)/registrar' as const;
    case 'CAPITAO':
      return '/(capitao)/hora-do-pato' as const;
  }
}

export function canAccessInstructor(perfil: Perfil | undefined): boolean {
  return perfil === 'TENENTE' || perfil === 'CAPITAO';
}
