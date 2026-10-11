import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useSession } from '../auth/SessionProvider';
import { homeRouteForProfile } from '../auth/routes';

export default function IndexScreen() {
  const { isLoading, session } = useSession();
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3D4F2F" />
      </View>
    );
  }
  return <Redirect href={session ? homeRouteForProfile(session.usuario.perfil) : '/(auth)/login'} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2EE',
  },
});
