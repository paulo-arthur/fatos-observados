import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { loginRequest, setUnauthorizedHandler } from '../api/client';
import { clearSession, readSession, saveSession } from './storage';
import type { Session } from './types';
import type { LoginInput } from './validation';

type SessionContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn: (input: LoginInput, onSlowConnection?: () => void) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    readSession()
      .then((stored) => {
        if (mounted) setSession(stored);
      })
      .catch(() => {
        if (mounted) setSession(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    queryClient.clear();
    setSession(null);
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const signIn = useCallback(
    async (input: LoginInput, onSlowConnection?: () => void) => {
      const nextSession = await loginRequest(input, onSlowConnection);
      await saveSession(nextSession);
      queryClient.clear();
      setSession(nextSession);
    },
    [queryClient],
  );

  const value = useMemo(
    () => ({ session, isLoading, signIn, signOut }),
    [session, isLoading, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession precisa de SessionProvider');
  return context;
}
