import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
  { icon: 'shield-checkmark-outline', label: 'Logement vérifié' },
  { icon: 'pricetag-outline', label: 'Prix négociable' },
  { icon: 'documents-outline', label: 'Contrat sécurisé' },
] as const;

export default function WelcomeScreen({ navigation }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  // Tier compact : surfaces réduites sur petits écrans → aucun chevauchement
  // possible du CTA avec les composants au-dessus (piliers de confiance, texte).
  const { height } = useWindowDimensions();
  const compact = height < 730;

  const sizes = useMemo(
    () =>
      compact
        ? {
            collage: 158,
            main: 130,
            card: { w: 102, h: 78 },
            gap: 20,
            eyebrowMb: 6,
            title: 35,
            titleLine: 40,
            subtitleMt: 10,
            subtitleLine: 22,
            barMt: 14,
            trustPadV: 7,
            trustFont: 9.5,
            legalMt: 12,
          }
        : {
            collage: 190,
            main: 158,
            card: { w: 122, h: 90 },
            gap: 26,
            eyebrowMb: 10,
            title: 41,
            titleLine: 46,
            subtitleMt: 14,
            subtitleLine: 24,
            barMt: 20,
            trustPadV: 9,
            trustFont: 10.5,
            legalMt: 18,
          },
    [compact],
  );

  const trustDims = useMemo(
    () => ({
      badge: compact ? 30 : 36,
      icon: compact ? 15 : 16,
      padV: compact ? 10 : 13,
      label: compact ? 10 : 11,
    }),
    [compact],
  );

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

        <View style={[styles.center, { gap: sizes.gap }]}>
          <Animated.View style={[styles.collage, { height: sizes.collage }, enter(1)]}>
            <Image
              source={COVERS.main}
              style={[styles.imgMain, { height: sizes.main }]}
              resizeMode="cover"
            />
            <View
              style={[
                styles.cardOver,
                styles.overLeft,
                { width: sizes.card.w, height: sizes.card.h },
                shadows.md,
              ]}
            >
              <Image
                source={COVERS.cardVilla}
                style={styles.imgOver}
                resizeMode="cover"
              />
            </View>
            <View
              style={[
                styles.cardOver,
                styles.overRight,
                { width: sizes.card.w, height: sizes.card.h },
                shadows.md,
              ]}
            >
              <Image
                source={COVERS.cardInterior}
                style={styles.imgOver}
                resizeMode="cover"
              />
            </View>
          </Animated.View>

          <Animated.View style={[styles.copy, enter(2)]}>
            <Text style={[styles.eyebrow, { marginBottom: sizes.eyebrowMb }]}>
              RDC · Immobilier
            </Text>
            <Text
              style={[
                styles.title,
                { fontSize: sizes.title, lineHeight: sizes.titleLine },
              ]}
            >
              Le logement{'\n'}
              <Text style={styles.accent}>plus simple.</Text>
            </Text>
            <Text
              style={[
                styles.subtitle,
                { marginTop: sizes.subtitleMt, lineHeight: sizes.subtitleLine },
              ]}
            >
              Trouvez, louez et vivez mieux avec la plateforme immobilière congolaise.
            </Text>
            <View style={[styles.accentBar, { marginTop: sizes.barMt }]} />
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.trustCard,
            { paddingVertical: trustDims.padV, marginTop: 16, marginBottom: 2 },
            enter(3),
          ]}
        >
          {TRUST.map((t, i) => (
            <Fragment key={t.label}>
              {i > 0 && <View style={styles.trustDivider} />}
              <View style={styles.trustCol}>
                <View
                  style={[
                    styles.trustBadge,
                    { width: trustDims.badge, height: trustDims.badge },
                  ]}
                >
                  <Ionicons name={t.icon} size={trustDims.icon} color={colors.teal} />
                </View>
                <Text
                  style={[styles.trustLabel, { fontSize: trustDims.label }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {t.label}
                </Text>
              </View>
            </Fragment>
          ))}
        </Animated.View>

        <Animated.View style={[styles.footer, enter(4)]}>
          <View style={styles.ctaGlow}>
            <PrimaryButton
              title="Se connecter"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
          <Text style={[styles.legal, { marginTop: sizes.legalMt }]}>
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
    marginBottom: 30,
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
  },
  collage: {
    height: 190,
    marginRight: 24,
  },
  imgMain: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderRadius: radius.xl,
  },
  cardOver: {
    position: 'absolute',
    bottom: 0,
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
  },
  title: {
    fontWeight: '900',
    letterSpacing: -1.9,
    color: colors.text,
  },
  accent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 15.5,
    color: colors.textMuted,
    maxWidth: 320,
  },
  accentBar: {
    width: 34,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  trustCard: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 6,
    alignItems: 'center',
    ...shadows.sm,
  },
  trustCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  trustDivider: {
    width: 1,
    height: '58%',
    backgroundColor: colors.border,
  },
  trustBadge: {
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustLabel: {
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  footer: {
    marginBottom: 14,
  },
  ctaGlow: {
    borderRadius: radius.pill,
    ...shadows.md,
  },
  legal: {
    textAlign: 'center',
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.textDim,
  },
});