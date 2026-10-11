import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import express from "express";
import bcrypt from "bcrypt";
import { createAuthRouter, type AuthDependencies, type LoginUser } from "../src/routes/auth.routes.js";

const user: LoginUser = {
  id: "61df2f62-e8df-4d59-a27d-595c10bf96cf",
  nome: "Aluno de Teste",
  email: "aluno.teste@example.com",
  senhaHash: bcrypt.hashSync("senha-correta", 4),
  perfil: "ALUNO",
  ativo: true,
};

const servers: Server[] = [];
afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  })));
});

function dependencies(overrides: Partial<AuthDependencies> = {}): AuthDependencies {
  return {
    findUserByEmail: async () => user,
    comparePassword: (password, hash) => bcrypt.compare(password, hash),
    createToken: () => "token-de-teste",
    reportError: () => {},
    ...overrides,
  };
}

async function postLogin(body: unknown, deps: AuthDependencies) {
  const app = express();
  app.use(express.json());
  app.use("/auth", createAuthRouter(deps));
  const server = await new Promise<Server>((resolve) => {
    const started = app.listen(0, "127.0.0.1", () => resolve(started));
  });
  servers.push(server);
  const port = (server.address() as AddressInfo).port;
  const response = await fetch(`http://127.0.0.1:${port}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() as Record<string, unknown> };
}

test("retorna 400 com mensagem em português para e-mail inválido", async () => {
  const response = await postLogin({ email: "nao-e-email", senha: "123456" }, dependencies());
  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: "E-mail inválido" });
});

test("retorna 400 para senha curta", async () => {
  const response = await postLogin({ email: user.email, senha: "12345" }, dependencies());
  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: "Senha deve ter no mínimo 6 caracteres" });
});

test("retorna 400 em português para um body inválido", async () => {
  const response = await postLogin([], dependencies());
  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: "Dados de login inválidos" });
});

test("usuário inexistente ainda compara com um hash falso e recebe 401", async () => {
  let compared = false;
  const response = await postLogin({ email: "ausente@example.com", senha: "qualquer-senha" }, dependencies({
    findUserByEmail: async () => null,
    comparePassword: async (password, hash) => {
      compared = true;
      assert.equal(password, "qualquer-senha");
      assert.match(hash, /^\$2[aby]\$/);
      return false;
    },
  }));
  assert.equal(compared, true);
  assert.equal(response.status, 401);
  assert.deepEqual(response.body, { error: "Credenciais inválidas" });
});

test("usuário inativo recebe a mesma resposta 401", async () => {
  const response = await postLogin({ email: user.email, senha: "senha-correta" }, dependencies({
    findUserByEmail: async () => ({ ...user, ativo: false }),
  }));
  assert.equal(response.status, 401);
  assert.deepEqual(response.body, { error: "Credenciais inválidas" });
});

test("senha errada recebe a mesma resposta 401", async () => {
  const response = await postLogin({ email: user.email, senha: "senha-errada" }, dependencies());
  assert.equal(response.status, 401);
  assert.deepEqual(response.body, { error: "Credenciais inválidas" });
});

test("retorna token e apenas os campos públicos do usuário", async () => {
  const response = await postLogin({ email: user.email, senha: "senha-correta" }, dependencies());
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    token: "token-de-teste",
    usuario: { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil },
  });
  assert.equal(JSON.stringify(response.body).includes("senhaHash"), false);
});

test("erro inesperado retorna 500 genérico e é registrado no servidor", async () => {
  const failure = new Error("falha de teste");
  let reported: unknown;
  const response = await postLogin({ email: user.email, senha: "senha-correta" }, dependencies({
    findUserByEmail: async () => { throw failure; },
    reportError: (error) => { reported = error; },
  }));
  assert.equal(response.status, 500);
  assert.deepEqual(response.body, { error: "Erro interno no servidor" });
  assert.equal(reported, failure);
});
