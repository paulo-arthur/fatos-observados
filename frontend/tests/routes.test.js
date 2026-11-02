import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

let vite;
let AppRoutes;
let AuthContext;

before(async () => {
  vite = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
    logLevel: 'error',
  });
  AppRoutes = (await vite.ssrLoadModule('/src/routes/AppRoutes.jsx')).default;
  AuthContext = (await vite.ssrLoadModule('/src/contexts/AuthContext.jsx')).AuthContext;
});

after(async () => { await vite?.close(); });

function render(path, rank = 'cap', signed = true) {
  return renderToString(createElement(AuthContext.Provider, {
    value: { signed, user: signed ? { id: 1, name: 'Instrutor Teste', email: 'teste@example.test', rank } : null, isCaptain: rank === 'cap', loginUser() {}, logoutUser() {} },
  }, createElement(MemoryRouter, { initialEntries: [path] }, createElement(AppRoutes))));
}

test('login renders an email/password form with accessible submit and password controls', () => {
  const html = render('/login', 'ten', false);
  assert.match(html, /type="email"/);
  assert.match(html, /type="password"/);
  assert.match(html, /autoComplete="current-password"/);
  assert.match(html, /Entrar no sistema/);
  assert.match(html, /Mostrar senha/);
});

for (const path of ['/dashboard', '/fo', '/students', '/instructors', '/fo/1', '/students/1', '/instructors/1']) {
  test(`unauthenticated access to ${path} never renders protected content`, () => {
    assert.equal(render(path, 'ten', false), '');
  });
}

for (const [path, title] of [
  ['/dashboard', 'Visão geral'], ['/fo', 'Fatos observados'], ['/students', 'Alunos'],
  ['/instructors', 'Instrutores'], ['/fo/1', 'Fato observado #1'],
  ['/students/1', 'Histórico do aluno'], ['/instructors/1', 'Detalhes do instrutor'],
]) {
  test(`signed-in route ${path} renders its page and the shared navigation`, () => {
    const html = render(path);
    assert.ok(html.includes(title));
    assert.match(html, /Navegação principal/);
    assert.match(html, /Sair da conta/);
    assert.match(html, /Carregando informações/);
  });
}

test('only captains see instructor registration controls', () => {
  assert.match(render('/instructors', 'cap'), /Novo instrutor/);
  assert.doesNotMatch(render('/instructors', 'ten'), /Novo instrutor/);
  assert.match(render('/instructors', 'ten'), /exclusivos de capitães/);
});
