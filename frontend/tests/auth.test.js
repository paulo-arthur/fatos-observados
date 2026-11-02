import { afterEach, beforeEach, test } from 'node:test';
import { Buffer } from 'node:buffer';
import assert from 'node:assert/strict';
import axios from 'axios';
import { api } from '../src/api/axios.js';
import { clearSession, parseToken, readSession, saveSession, SESSION_EVENT } from '../src/auth/session.js';
import { errorMessage, matches } from '../src/utils/format.js';

const claims = { id: 7, name: 'João da Silva', email: 'joao@ime.br', rank: 'cap', exp: Math.floor(Date.now() / 1000) + 86400 };
const makeToken = (payload = claims) => `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.test-signature`;
const token = makeToken();
const originalAdapter = api.defaults.adapter;

beforeEach(() => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
  globalThis.window = new EventTarget();
});

afterEach(() => {
  api.defaults.adapter = originalAdapter;
  delete globalThis.localStorage;
  delete globalThis.window;
});

test('restores the signed-in user from JWT claims, including accented names', () => {
  saveSession(token);
  localStorage.setItem('user', '{broken legacy JSON');
  assert.deepEqual(readSession().user, { id: 7, name: 'João da Silva', email: 'joao@ime.br', rank: 'cap' });
  assert.equal(readSession().expiresAt, claims.exp * 1000);
});

test('rejects expired, malformed and incomplete sessions', () => {
  for (const invalid of [null, '', 'broken', 'a.e30', 'a.e30.b', makeToken({ ...claims, exp: 1 }), makeToken({ ...claims, rank: null }), makeToken({ ...claims, id: -1 })]) {
    assert.equal(parseToken(invalid), null);
    localStorage.setItem('token', invalid);
    assert.equal(readSession(), null);
  }
  assert.throws(() => saveSession('invalid'), /sessão inválida/);
});

test('logout clears both current and legacy storage and notifies React', () => {
  saveSession(token);
  localStorage.setItem('user', '{}');
  let changes = 0;
  window.addEventListener(SESSION_EVENT, () => changes++);
  clearSession();
  assert.equal(readSession(), null);
  assert.equal(localStorage.getItem('user'), null);
  assert.equal(changes, 1);
});

test('storage unavailability returns an unauthenticated session', () => {
  localStorage.getItem = () => { throw new Error('storage disabled'); };
  assert.equal(readSession(), null);
});

test('successful HTTP responses reach callers and requests carry a Bearer token', async () => {
  saveSession(token);
  api.defaults.adapter = async (config) => {
    assert.equal(config.headers.Authorization, `Bearer ${token}`);
    assert.equal(config.url, '/students');
    return { data: [{ id: 1, nome: 'Aluno Silva' }], status: 200, headers: {}, config };
  };
  const response = await api.get('/students');
  assert.equal(response.data[0].nome, 'Aluno Silva');
});

test('login sends the backend contract without a previous Authorization header', async () => {
  saveSession(token);
  api.defaults.adapter = async (config) => {
    assert.equal(config.headers.Authorization, undefined);
    assert.deepEqual(JSON.parse(config.data), { email: 'cap@ime.br', password: 'senha-teste' });
    return { data: { token, instructor: readSession().user }, status: 200, headers: {}, config };
  };
  const response = await api.post('/auth/login', { email: 'cap@ime.br', password: 'senha-teste' });
  assert.equal(response.data.token, token);
});

for (const [status, message, expires] of [
  [401, 'Access denied. Token missing.', true],
  [403, 'Invalid or expired token.', true],
  [403, 'Access denied. Only Captains can perform this action.', false],
  [500, 'An error has occurred.', false],
]) {
  test(`HTTP ${status} (${message}) ${expires ? 'clears' : 'preserves'} the session`, async () => {
    saveSession(token);
    api.defaults.adapter = async (config) => {
      throw new axios.AxiosError('Request failed', 'ERR_BAD_RESPONSE', config, null,
        { data: { error: message }, status, headers: {}, config });
    };
    await assert.rejects(api.get('/fos'));
    assert.equal(!!readSession(), !expires);
  });
}

test('invalid login does not trigger protected-request session handling', async () => {
  saveSession(token);
  api.defaults.adapter = async (config) => {
    throw new axios.AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null,
      { data: { error: 'Invalid credentials.' }, status: 401, headers: {}, config });
  };
  await assert.rejects(api.post('/auth/login', { email: 'a@b.br', password: 'wrong' }));
  assert.ok(readSession());
});

test('network and backend validation errors produce usable messages', () => {
  assert.match(errorMessage({ isAxiosError: true }), /conectar ao servidor/);
  assert.equal(errorMessage({ response: { status: 409, data: { erro: 'Este número de aluno já está em uso.' } } }), 'Este número de aluno já está em uso.');
  assert.equal(errorMessage({ response: { status: 409, data: { error: 'This email is already registered.' } } }), 'Este e-mail já está cadastrado.');
  assert.match(errorMessage({ response: { status: 401, data: {} } }), /senha incorretos/);
});

test('directory search is case and accent insensitive', () => {
  assert.ok(matches('JOAO', 'João da Silva', '26001'));
  assert.ok(matches('26001', 'João da Silva', '26001'));
  assert.equal(matches('Carlos', 'João da Silva'), false);
});
