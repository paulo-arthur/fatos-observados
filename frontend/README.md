# Fatos Observados — frontend

Aplicação React integrada às rotas existentes do backend, com interface em português e layout responsivo.

## Executar

Na pasta `frontend`:

```sh
npm install
npm run dev
```

O frontend usa `/api` e o proxy do Vite encaminha as requisições para `http://localhost:3000`. O backend precisa estar em execução, com o banco configurado. Para executá-lo, use `npm start` em `backend`.

Se a API estiver em outro endereço, copie `.env.example` para `.env` e ajuste `API_PROXY_TARGET`. Reinicie o Vite após mudar variáveis de ambiente.

## Acesso

Entre com o e-mail e a senha de um instrutor ativo já cadastrado no banco. Não existe rota pública de cadastro, recuperação ou troca de senha no backend atual.

O login usa `POST /auth/login`, armazena o JWT e envia `Authorization: Bearer <token>` nas requisições protegidas. A sessão é restaurada ao recarregar a página, sincronizada entre abas e encerrada no logout, na expiração do token e quando a API rejeita o token. Uma negativa de permissão de capitão não encerra a sessão.

**Atenção ao seed:** `backend/database/seed.sql` contém valores fictícios de `senha_hash`, que não são hashes bcrypt válidos. Esses valores não permitem login. Use uma conta com hash válido no banco existente. O frontend não cria contas de demonstração nem modifica o backend ou o banco para contornar essa condição.

## Funcionalidades

- Visão geral com indicadores e fatos mais recentes.
- Fatos observados: listagem, busca, filtros por julgamento, ordenação, detalhes e criação com o instrutor autenticado como autor.
- Alunos: listagem, busca, cadastro, detalhes e histórico individual.
- Instrutores: listagem, busca, filtros de acesso e detalhes.
- Capitães: cadastro de instrutores, ativação/desativação de acesso e julgamento de fatos, com confirmação das ações.
- Mensagens de erro, estados de carregamento, listas vazias, formulários acessíveis e navegação protegida.

As permissões exibidas seguem a identificação de capitão usada pelo backend (`rank` contendo `cap`). A autorização efetiva continua sendo realizada pela API. Ao desativar a própria conta, o frontend encerra a sessão local.

## Contrato da API

| Recurso | Rotas utilizadas |
| --- | --- |
| Autenticação | `POST /auth/login` |
| Fatos observados | `GET /fos`, `GET /fos/:id`, `POST /fos`, `PATCH /fos/:id` |
| Histórico do aluno | `GET /fos/student/:studentId` |
| Alunos | `GET /students`, `GET /students/:id`, `POST /students` |
| Instrutores | `GET /instructors`, `GET /instructors/:id`, `POST /instructors`, `PATCH /instructors/:id` |

A consulta de um fato retorna duas colunas com o nome `nome`. O frontend cruza as listagens de fatos, alunos e instrutores pelos IDs para identificar corretamente autor e aluno, sem depender desse campo ambíguo.

## Verificar

```sh
npm test
npm run lint
npm run build
```

Os testes usam o executor nativo do Node e verificam a sessão, os interceptadores HTTP, o contrato do login e os erros. Não precisam de banco nem alteram dados.

## Produção

O build fica em `dist/`. Configure `VITE_API_URL` com a URL pública da API antes de compilar, ou configure o servidor web para encaminhar `/api` ao backend. O proxy de desenvolvimento do Vite não faz parte do build. O servidor que hospedar `dist/` também deve servir `index.html` nas rotas do frontend, permitindo abrir diretamente URLs como `/fo/1` e `/students/1`.
