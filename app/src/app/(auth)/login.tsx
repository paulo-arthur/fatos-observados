import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ApiError } from '../../api/client';
import { useSession } from '../../auth/SessionProvider';
import { validateLoginInput } from '../../auth/validation';

function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Credenciais inválidas';
    if (error.kind === 'network') return 'Sem conexão. Verifique a internet e tente de novo.';
    if (error.kind === 'timeout') return 'O servidor não respondeu. Tente de novo.';
    return error.message;
  }
  return 'Não foi possível entrar. Tente de novo.';
}

export default function LoginScreen() {
  const { signIn } = useSession();
  const passwordRef = useRef<TextInput>(null);
  const submittingRef = useRef(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  async function submit() {
    if (submittingRef.current) return;
    const validation = validateLoginInput(email, senha);
    setErrors(validation.errors);
    setServerError(null);
    setIsSlow(false);
    if (!validation.data) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      await signIn(validation.data, () => setIsSlow(true));
    } catch (error) {
      setServerError(loginErrorMessage(error));
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
      setIsSlow(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brand}>
            <View style={styles.crestSpace} />
            <Text style={styles.brandTitle}>Fatos Observados</Text>
            <Text style={styles.brandSubtitle}>Instituto Militar de Engenharia</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>Entrar</Text>
            <Text style={styles.formDescription}>
              Use seu e-mail e senha para acessar seus Fatos Observados.
            </Text>

            <Text style={styles.label} nativeID="email-label">E-mail</Text>
            <TextInput
              accessibilityLabel="E-mail"
              accessibilityLabelledBy="email-label"
              accessibilityHint="Informe o e-mail de sua conta"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              style={[styles.input, errors.email ? styles.inputError : null]}
            />
            {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}

            <Text style={[styles.label, styles.passwordLabel]} nativeID="password-label">Senha</Text>
            <TextInput
              ref={passwordRef}
              accessibilityLabel="Senha"
              accessibilityLabelledBy="password-label"
              accessibilityHint="Informe sua senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={() => { void submit(); }}
              style={[styles.input, errors.senha ? styles.inputError : null]}
            />
            {errors.senha ? <Text style={styles.fieldError}>{errors.senha}</Text> : null}

            {serverError ? (
              <View style={styles.errorBox} accessibilityLiveRegion="polite">
                <Text style={styles.errorText}>{serverError}</Text>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Entrar"
              accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
              disabled={isSubmitting}
              onPress={() => { void submit(); }}
              style={({ pressed }) => [
                styles.button,
                pressed && !isSubmitting ? styles.buttonPressed : null,
                isSubmitting ? styles.buttonBusy : null,
              ]}
            >
              <Text style={styles.buttonText}>{isSubmitting ? 'Entrando...' : 'Entrar'}</Text>
            </Pressable>
            {isSlow && isSubmitting ? (
              <Text style={styles.slowText} accessibilityLiveRegion="polite">
                Conectando ao servidor. Pode levar alguns segundos.
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#2C3A21' },
  scrollContent: { flexGrow: 1, backgroundColor: '#F2F2EE' },
  brand: { backgroundColor: '#3D4F2F', paddingHorizontal: 24, paddingTop: 38, paddingBottom: 34 },
  crestSpace: { width: 56, height: 56, marginBottom: 22 },
  brandTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  brandSubtitle: { color: '#E4E8DC', fontSize: 16, marginTop: 6 },
  form: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 36 },
  formTitle: { color: '#1A1A1A', fontSize: 22, fontWeight: '700' },
  formDescription: { color: '#4A4A4A', fontSize: 16, lineHeight: 23, marginTop: 8, marginBottom: 28 },
  label: { color: '#1A1A1A', fontSize: 15, fontWeight: '600', marginBottom: 7 },
  passwordLabel: { marginTop: 20 },
  input: { height: 52, borderWidth: 1.5, borderColor: '#8C8C84', borderRadius: 6, backgroundColor: '#FFFFFF', color: '#1A1A1A', fontSize: 17, paddingHorizontal: 14 },
  inputError: { borderColor: '#9B1C1C' },
  fieldError: { color: '#9B1C1C', fontSize: 15, fontWeight: '600', marginTop: 6 },
  errorBox: { backgroundColor: '#FFFFFF', borderColor: '#9B1C1C', borderWidth: 2, borderRadius: 6, padding: 14, marginTop: 22 },
  errorText: { color: '#9B1C1C', fontSize: 16, fontWeight: '500' },
  button: { minHeight: 52, borderRadius: 6, backgroundColor: '#3D4F2F', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  buttonPressed: { backgroundColor: '#2C3A21' },
  buttonBusy: { opacity: 0.75 },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  slowText: { color: '#4A4A4A', fontSize: 15, lineHeight: 21, textAlign: 'center', marginTop: 12 },
});
