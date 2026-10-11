export type Perfil = 'ALUNO' | 'TENENTE' | 'CAPITAO';

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
};

export type Session = {
  token: string;
  usuario: Usuario;
};
