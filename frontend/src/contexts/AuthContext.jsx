import { createContext, useEffect, useState } from 'react';
import { api } from '../api/axios.js';
import { clearSession, readSession, saveSession, SESSION_EVENT } from '../auth/session.js';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  useEffect(() => {
    const sync = () => setSession(readSession());
    window.addEventListener(SESSION_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SESSION_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    const timer = window.setTimeout(clearSession, Math.max(0, session.expiresAt - Date.now()));
    return () => window.clearTimeout(timer);
  }, [session]);

  async function loginUser(email, password) {
    const { data } = await api.post('/auth/login', { email: email.trim().toLowerCase(), password });
    saveSession(data.token);
  }

  return (
    <AuthContext.Provider value={{
      signed: !!session,
      user: session?.user,
      isCaptain: session?.user.rank.toLowerCase().includes('cap') ?? false,
      loginUser,
      logoutUser: clearSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
