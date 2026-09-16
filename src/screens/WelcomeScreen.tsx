import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/ui/PrimaryButton';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, shadows } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const COVERS = {
  main: require('../../assets/immo/casa.jpg'),
  cardVilla: require('../../assets/immo/villa.jpg'),
  cardInterior: require('../../assets/immo/interieur.jpg'),
} as const;

const TRUST = [
  { icon: 'shield-checkmark-outline', label: 'Voisinage vérifié' },
  { icon: 'pricetag-outline', label: 'Prix négociable' },
  { icon: 'documents-outline', label: 'Contrat sécurisé' },
] as const;

export default function WelcomeScreen({ navigation }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const enter = (i: number) => ({
    opacity: progress.interpolate({
      inputRange: [i * 0.15, i * 0.15 + 0.4],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [i * 0.15, i * 0.15 + 0.4],
          outputRange: [18, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  });

  return (
    <LinearGradient
      colors={[colors.cream, colors.surface]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.screen}
    >
      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[styles.header, enter(0)]}
        >
          <View style={styles.brand}>
            <LinearGradient
              colors={[colors.teal, colors.tealBright]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.brandMark}
            >
              <Ionicons name="home" size={16} color={colors.white} />
            </LinearGradient>
            <Text style={styles.brandName}>Panga</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Listings')}
            hitSlop={12}
            style={({ pressed }) => [styles.skipChip, pressed && styles.skipPressed]}
          >
            <Text style={styles.skip}>Passer</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.center}>
          <Animated.View style={[styles.collage, enter(1)]}>
            <Image source={COVERS.main} style={styles.imgMain} resizeMode="cover" />
            <View style={[styles.cardOver, styles.overLeft, shadows.md]}>
              <Image
                source={COVERS.cardVilla}
                style={styles.imgOver}
                resizeMode="cover"
              />
            </View>
            <View style={[styles.cardOver, styles.overRight, shadows.md]}>
              <Image
                source={COVERS.cardInterior}
                style={styles.imgOver}
                resizeMode="cover"
              />
            </View>
          </Animated.View>

          <Animated.View style={[styles.copy, enter(2)]}>
            <Text style={styles.eyebrow}>RDC · Immobilier</Text>
            <Text style={styles.title}>
              Le logement{'\n'}
              <Text style={styles.accent}>plus simple.</Text>
            </Text>
            <Text style={styles.subtitle}>
              Trouvez, louez et vivez mieux avec la plateforme immobilière congolaise.
            </Text>
            <View style={styles.accentBar} />
          </Animated.View>

          <Animated.View style={[styles.trust, enter(3)]}>
            {TRUST.map((t) => (
              <View key={t.label} style={styles.trustPill}>
                <Ionicons name={t.icon} size={14} color={colors.teal} />
                <Text style={styles.trustLabel}>{t.label}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        <Animated.View style={[styles.footer, enter(4)]}>
          <View style={styles.ctaGlow}>
            <PrimaryButton
              title="Se connecter"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
          <Text style={styles.legal}>
            En continuant, vous acceptez nos conditions d'utilisation et notre
            politique de confidentialité.
          </Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  brandName: {
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -1.2,
    color: colors.text,
  },
  skipChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  skipPressed: {
    opacity: 0.65,
  },
  skip: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: 30,
  },
  collage: {
    height: 216,
  },
  imgMain: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    borderRadius: radius.xl,
  },
  cardOver: {
    position: 'absolute',
    bottom: 0,
    width: 128,
    height: 96,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.surface,
    overflow: 'hidden',
  },
  overLeft: {
    left: -4,
    transform: [{ rotate: '-4deg' }],
  },
  overRight: {
    right: -4,
    transform: [{ rotate: '3deg' }],
  },
  imgOver: {
    width: '100%',
    height: '100%',
  },
  copy: {
    gap: 0,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.teal,
    marginBottom: 10,
  },
  title: {
    fontSize: 41,
    lineHeight: 46,
    fontWeight: '900',
    letterSpacing: -1.9,
    color: colors.text,
  },
  accent: {
    color: colors.primary,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 15.5,
    lineHeight: 24,
    color: colors.textMuted,
    maxWidth: 320,
  },
  accentBar: {
    marginTop: 20,
    width: 34,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  trust: {
    flexDirection: 'row',
    gap: 8,
  },
  trustPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  trustLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textMuted,
  },
  footer: {
    marginBottom: 14,
  },
  ctaGlow: {
    borderRadius: radius.pill,
    ...shadows.md,
  },
  legal: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.textDim,
  },
});