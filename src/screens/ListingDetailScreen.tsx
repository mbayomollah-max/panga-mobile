import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import type { RootStackParamList } from '../navigation/types';
import { createRequest, fetchListing, formatPrix } from '../api';
import Avatar from '../components/ui/Avatar';
import Chip from '../components/ui/Chip';
import { colors, gradients, radius, shadows } from '../theme';
import type { ListingDetail } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ListingDetail'>;

export default function ListingDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const { profile, token, signOut } = useAuth();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setListing(await fetchListing(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger la fiche.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const onRequest = async () => {
    if (!listing) return;
    if (!profile || !token) {
      Alert.alert(
        'Connexion requise',
        'Connectez-vous pour demander ce logement.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Login') },
        ],
      );
      return;
    }
    setRequesting(true);
    try {
      const guarantee = listing.guarantee_reference ?? 0;
      await createRequest(token, listing.housing_id, guarantee);
      Alert.alert(
        'Demande envoyée',
        'Le bailleur a reçu votre demande. Il vous répondra dans son espace propriétaire.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (e) {
      if (e instanceof Error && e.message === 'session') {
        await signOut();
        Alert.alert(
          'Session expirée',
          'Reconnectez-vous pour continuer.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
        );
      } else {
        Alert.alert(
          'Erreur',
          e instanceof Error ? e.message : 'La demande n\'a pas pu être enregistrée.',
        );
      }
    } finally {
      setRequesting(false);
    }
  };

  const mainImage = listing?.pictures?.[0]?.url ?? listing?.cover_url ?? null;

  const stars = (rating?: number | null) => {
    if (!rating) return '—';
    const n = Math.min(5, Math.max(0, Math.round(rating)));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.centered} edges={['top', 'bottom']}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </View>
    );
  }

  if (error || !listing) {
    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.centered} edges={['top', 'bottom']}>
          <Text style={styles.errorText}>{error ?? 'Fiche introuvable.'}</Text>
          <TouchableOpacity onPress={load}>
            <Text style={styles.retry}>Réessayer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
            <Text style={styles.backLinkText}>← Retour à la liste</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.hero}>
            {mainImage ? (
              <Image source={{ uri: mainImage }} style={styles.heroImage} />
            ) : (
              <LinearGradient
                colors={[...gradients.card]}
                style={[styles.heroImage, styles.heroFallback]}
              >
                <Ionicons name="home" size={64} color="rgba(255,255,255,0.35)" />
              </LinearGradient>
            )}
            <LinearGradient
              colors={['rgba(7,17,32,0.35)', 'transparent']}
              style={styles.heroTopFade}
            />

            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.roundBtn}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={24} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.roundBtn}
                onPress={() =>
                  Alert.alert('Partager', 'Le partage arrive bientôt.')
                }
              >
                <Ionicons name="share-outline" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.eyebrowRow}>
              <View style={styles.statePill}>
                <View style={styles.stateDot} />
                <Text style={styles.stateText}>Disponible</Text>
              </View>
              {listing.has_equip ? <Text style={styles.equipNote}>Équipé</Text> : null}
            </View>

            <Text style={styles.type}>{listing.type_name}</Text>

            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={styles.location}>
                {listing.address || listing.quarter_name} · {listing.township_name} ·{' '}
                {listing.town_name}
              </Text>
            </View>

            <View style={styles.chipsRow}>
              <Chip label={`${listing.surface} m²`} tone="soft" />
              <Chip label={`Réf. ${listing.housing_id.slice(0, 6).toUpperCase()}`} />
            </View>

            {listing.caracts.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Caractéristiques</Text>
                <View style={styles.chipsWrap}>
                  {listing.caracts.map((c) => (
                    <Chip
                      key={c.caract_id}
                      label={c.number > 1 ? `${c.name} ×${c.number}` : c.name}
                    />
                  ))}
                </View>
              </View>
            )}

            {listing.equips.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Équipements</Text>
                <View style={styles.equipsGrid}>
                  {listing.equips.map((e) => (
                    <View key={e.equip_id} style={styles.equipItem}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                      <Text style={styles.equipItemText}>{e.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bailleur</Text>
              <View style={styles.ownerCard}>
                <Avatar name={listing.owner_name} size={52} />
                <View style={styles.ownerInfo}>
                  <View style={styles.ownerNameRow}>
                    <Text style={styles.ownerName}>{listing.owner_name}</Text>
                    {listing.owner_verified ? (
                      <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
                    ) : null}
                  </View>
                  <Text style={styles.ownerRating}>
                    {stars(listing.owner_rating)} · {listing.review_count} avis
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
              </View>
            </View>

            {typeof listing.guarantee_reference === 'number' && (
              <Text style={styles.guide}>
                Garantie de référence : {listing.guarantee_reference} $
              </Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.actionBar}>
          <View style={styles.actionPrice}>
            <Text style={styles.actionPriceValue}>{formatPrix(listing.prix)}</Text>
            <Text style={styles.actionPriceLabel}>garantie incluse</Text>
          </View>
          <TouchableOpacity
            style={[styles.actionButton, requesting && styles.actionButtonDisabled]}
            activeOpacity={0.9}
            onPress={onRequest}
            disabled={requesting}
          >
            <LinearGradient colors={[...gradients.cta]} style={styles.actionGradient}>
              {requesting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.actionButtonText}>Demander</Text>
              )}
              {!requesting ? (
                <Ionicons name="arrow-forward" size={19} color={colors.white} />
              ) : null}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
  },
  retry: {
    marginTop: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  backLink: {
    marginTop: 16,
  },
  backLinkText: {
    color: colors.primary,
  },
  scroll: {
    paddingBottom: 110,
  },
  hero: {
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
  },
  heroFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTopFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
  },
  heroActions: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(7, 17, 32, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: -24,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  stateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.tealDark,
  },
  equipNote: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  type: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    color: colors.text,
    textTransform: 'capitalize',
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  location: {
    flex: 1,
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: '500',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  section: {
    marginTop: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  equipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10,
  },
  equipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  equipItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  ownerRating: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
  },
  guide: {
    marginTop: 18,
    fontSize: 13,
    color: colors.textSoft,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  actionPrice: {
    flex: 1,
  },
  actionPriceValue: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
  },
  actionPriceLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  actionButton: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    ...(shadows.md as object),
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 15,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});