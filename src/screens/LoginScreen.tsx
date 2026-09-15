import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import IdPButton from '../components/ui/IdPButton';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const connect = async () => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      const result = await signIn();
      if (result.profile) {
        navigation.navigate('Listings');
        return;
      }
      const texts: Record<string, [string, string]> = {
        cancelled: ['Connexion annulée', 'La page de connexion a été fermée. Réessayez.'],
        no_token: ['Session non reçue', 'Après connexion Mbayo, la session n\'a pas été transmise à l\'app. Réessayez.'],
        invalid_session: ['Session refusée', 'Le compte Mbayo n\'a pas pu être validé. Réessayez ou créez un compte.'],
        network: ['Erreur réseau', 'Impossible de contacter le service de connexion.'],
      };
      const [title, message] = texts[result.reason] ?? ['Connexion annulée', 'Réessayez.'];
      Alert.alert(title, message);
    } catch {
      Alert.alert('Erreur', 'Impossible de contacter le service de connexion.');
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.head}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>

          <View style={styles.titleBlock}>
            <Text style={styles.eyebrow}>BIENVENUE</Text>
            <Text style={styles.title}>Connectez-vous</Text>
            <Text style={styles.subtitle}>
              Accédez à vos recherches et à vos logements en quelques secondes.
            </Text>
          </View>

          <View style={styles.actions}>
            <IdPButton
              title={signingIn ? 'Connexion en cours…' : 'Se connecter avec Mbayo'}
              onPress={connect}
              disabled={signingIn}
            />
            {signingIn ? (
              <ActivityIndicator
                style={styles.spinner}
                color={colors.primary}
              />
            ) : null}

            <View style={styles.signupRow}>
              <Text style={styles.signupHint}>Nouveau sur Panga ?</Text>
              <Pressable onPress={connect} hitSlop={8}>
                <Text style={styles.signupLink}>Créer un compte</Text>
              </Pressable>
            </View>

            <Text style={styles.note}>
              Connexion sécurisée avec votre compte Mbayo.
            </Text>
          </View>
        </View>
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
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  head: {
    flex: 1,
    marginTop: 12,
  },
  titleBlock: {
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
  actions: {
    marginTop: 40,
  },
  spinner: {
    marginTop: 12,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
  note: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textDim,
  },
});