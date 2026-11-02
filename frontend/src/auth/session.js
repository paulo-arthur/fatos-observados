export const SESSION_EVENT = 'fo:session-change';

export function parseToken(token) {
  try {
    if (typeof token !== 'string' || token.split('.').length !== 3) return null;
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(payload), (char) => char.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes));
    if (!Number.isInteger(claims.id) || claims.id <= 0 ||
      typeof claims.name !== 'string' || !claims.name ||
      typeof claims.email !== 'string' || !claims.email ||
      typeof claims.rank !== 'string' || !claims.rank ||
      !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) return null;
    return claims;
  } catch {
    return null;
  }
}

export function readSession() {
  try {
    const token = localStorage.getItem('token');
    const claims = token && parseToken(token);
    if (!claims) return null;
    return {
      token,
      expiresAt: claims.exp * 1000,
      user: { id: claims.id, name: claims.name, email: claims.email, rank: claims.rank },
    };
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } finally {
    window.dispatchEvent(new Event(SESSION_EVENT));
  }
}

export function saveSession(token) {
  if (!parseToken(token)) throw new Error('O servidor retornou uma sessão inválida.');
  localStorage.setItem('token', token);
  window.dispatchEvent(new Event(SESSION_EVENT));
}
