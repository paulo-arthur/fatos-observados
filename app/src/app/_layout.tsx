import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { SessionProvider, useSession } from '../auth/SessionProvider';
import { canAccessInstructor } from '../auth/routes';

const queryClient = new QueryClient();

function RootNavigator() {
  const { isLoading, session } = useSession();
  const perfil = session?.usuario.perfil;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!isLoading && !session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoading && perfil === 'ALUNO'}>
        <Stack.Screen name="(aluno)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoading && canAccessInstructor(perfil)}>
        <Stack.Screen name="(instrutor)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoading && perfil === 'CAPITAO'}>
        <Stack.Screen name="(capitao)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RootNavigator />
      </SessionProvider>
    </QueryClientProvider>
  );
}
