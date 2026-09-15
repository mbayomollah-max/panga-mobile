import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../components/ui/FormInput';
import PrimaryButton from '../components/ui/PrimaryButton';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = () => {
    const next: { email?: string; password?: string } = {};
    if (!EMAIL_RE.test(email.trim())) next.email = 'Adresse e-mail invalide.';
    if (password.length < 6) next.password = 'Au moins 6 caractères.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    Alert.alert('Bienvenue 👋', 'La connexion réelle (OAuth Mbayo) arrive bientôt.');
    navigation.navigate('Listings');
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>

            <View style={styles.head}>
              <Text style={styles.eyebrow}>BIENVENUE</Text>
              <Text style={styles.title}>Connectez-vous</Text>
              <Text style={styles.subtitle}>
                Accédez à vos recherches et à vos logements.
              </Text>
            </View>

            <View style={styles.form}>
              <FormInput
                label="E-mail"
                icon="mail-outline"
                placeholder="vous@exemple.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                error={errors.email}
              />
              <FormInput
                label="Mot de passe"
                icon="lock-closed-outline"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                error={errors.password}
              />

              <Pressable
                style={styles.forgot}
                onPress={() =>
                  Alert.alert('Mot de passe oublié', 'Réinitialisation bientôt disponible.')
                }
                hitSlop={8}
              >
                <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
              </Pressable>

              <PrimaryButton title="Se connecter" onPress={submit} />

              <View style={styles.signupRow}>
                <Text style={styles.signupHint}>Pas encore de compte ?</Text>
                <Pressable
                  onPress={() =>
                    Alert.alert('Inscription', 'La création de compte arrive bientôt.')
                  }
                  hitSlop={8}
                >
                  <Text style={styles.signupLink}>Créer un compte</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  back: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
  },
  head: {
    marginTop: 44,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.primary,
  },
  title: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1.2,
    color: colors.text,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 23,
    color: colors.textMuted,
  },
  form: {
    marginTop: 36,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  signupHint: {
    fontSize: 15,
    color: colors.textMuted,
  },
  signupLink: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});