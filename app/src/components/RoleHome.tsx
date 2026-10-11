import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '../auth/SessionProvider';

type Props = {
  title: string;
  description: string;
  showInstructorLink?: boolean;
  showCaptainLink?: boolean;
};

export function RoleHome({ title, description, showInstructorLink, showCaptainLink }: Props) {
  const { session, signOut } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setError(null);
    try {
      await signOut();
    } catch {
      setError('Não foi possível sair. Tente de novo.');
      setIsSigningOut(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Fatos Observados</Text>
          <Text style={styles.headerSubtitle}>{session?.usuario.nome}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sair"
          accessibilityState={{ disabled: isSigningOut, busy: isSigningOut }}
          onPress={handleSignOut}
          disabled={isSigningOut}
          style={styles.signOutButton}
        >
          <Text style={styles.signOutText}>Sair</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.profile}>Perfil: {session?.usuario.perfil}</Text>
        <Text style={styles.description}>{description}</Text>
        {showInstructorLink ? (
          <Link href="/(instrutor)/registrar" asChild>
            <Pressable accessibilityRole="button" style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Área do instrutor</Text>
            </Pressable>
          </Link>
        ) : null}
        {showCaptainLink ? (
          <Link href="/(capitao)/hora-do-pato" asChild>
            <Pressable accessibilityRole="button" style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Área do capitão</Text>
            </Pressable>
          </Link>
        ) : null}
        {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2C3A21' },
  header: { minHeight: 72, backgroundColor: '#3D4F2F', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  headerText: { flex: 1 },
  headerTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '600' },
  headerSubtitle: { color: '#E4E8DC', fontSize: 14, marginTop: 4 },
  signOutButton: { height: 44, minWidth: 64, borderWidth: 1.5, borderColor: '#8A9A7A', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  signOutText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  content: { flexGrow: 1, backgroundColor: '#F2F2EE', paddingHorizontal: 20, paddingTop: 32, paddingBottom: 32 },
  title: { color: '#1A1A1A', fontSize: 24, fontWeight: '700' },
  profile: { color: '#3D4F2F', fontSize: 15, fontWeight: '700', marginTop: 12 },
  description: { color: '#4A4A4A', fontSize: 16, lineHeight: 23, marginTop: 20, marginBottom: 20 },
  secondaryButton: { minHeight: 52, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#3D4F2F', borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  secondaryText: { color: '#3D4F2F', fontSize: 17, fontWeight: '600' },
  error: { color: '#9B1C1C', fontSize: 15, marginTop: 20 },
});
