import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/ui/PrimaryButton';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, shadows } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const COVERS = [
  require('../../assets/immo/casa.jpg'),
  require('../../assets/immo/villa.jpg'),
  require('../../assets/immo/interieur.jpg'),
] as const;

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
          <View style={styles.collage}>
              <View style={[styles.colMain, styles.shadowSoft]}>
                <Image
                  source={COVERS[0]}
                  style={styles.imgMain}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.colSide}>
                <View style={[styles.imgSideWrap, styles.shadowSoft]}>
                  <Image
                    source={COVERS[1]}
                    style={styles.imgSide}
                    resizeMode="cover"
                  />
                </View>
                <View style={[styles.imgSideWrap, styles.shadowSoft]}>
                  <Image
                    source={COVERS[2]}
                    style={styles.imgSide}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>
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
    gap: 26,
  },
  collage: {
    flexDirection: 'row',
    gap: 12,
    height: 148,
  },
  colMain: {
    flex: 1,
    borderRadius: radius.lg,
  },
  colSide: {
    width: '38%',
    justifyContent: 'space-between',
  },
  imgMain: {
    width: '100%',
    height: '100%',
    borderRadius: radius.lg,
  },
  imgSideWrap: {
    height: '46%',
    borderRadius: radius.lg,
  },
  imgSide: {
    width: '100%',
    height: '100%',
    borderRadius: radius.lg,
  },
  shadowSoft: {
    ...shadows.md,
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
  legal: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 17,
    color: colors.textDim,
  },
});