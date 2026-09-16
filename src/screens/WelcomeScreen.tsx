import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/ui/PrimaryButton';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Ionicons name="home" size={14} color={colors.primary} />
            </View>
            <Text style={styles.brandName}>Panga</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('Listings')} hitSlop={12}>
            <Text style={styles.skip}>Passer</Text>
          </Pressable>
        </View>

        <View style={styles.center}>
          <Text style={styles.title}>
            Le logement{'\n'}
            <Text style={styles.accent}>plus simple.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Trouvez, louez et vivez mieux avec la plateforme immobilière congolaise.
          </Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title="Se connecter"
            onPress={() => navigation.navigate('Login')}
          />
          <View style={styles.signupRow}>
            <Text style={styles.signupHint}>Nouveau sur Panga ?</Text>
            <Pressable onPress={() => navigation.navigate('Login')} hitSlop={8}>
              <Text style={styles.signupLink}>Créer un compte</Text>
            </Pressable>
          </View>
          <Text style={styles.legal}>
            En continuant, vous acceptez nos conditions d'utilisation et notre
            politique de confidentialité.
          </Text>
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
  },
  header: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  brandMark: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.text,
  },
  skip: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
    letterSpacing: -1.6,
    color: colors.text,
  },
  accent: {
    color: colors.primary,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
  },
  footer: {
    marginBottom: 12,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
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
  legal: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 17,
    color: colors.textDim,
  },
});