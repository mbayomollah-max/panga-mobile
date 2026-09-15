import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatPrix } from '../api';
import { colors, gradients, radius, shadows } from '../theme';
import type { PublicHousing } from '../types';

interface Props {
  listing: PublicHousing;
  onPress: (id: string) => void;
}

export default function ListingCard({ listing, onPress }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasCover = Boolean(listing.cover_url) && !imageFailed;

  return (
    <Pressable
      onPress={() => onPress(listing.housing_id)}
      style={({ pressed }) => [styles.card, shadows.md, pressed && styles.pressed]}
    >
      <View style={styles.cover}>
        {hasCover ? (
          <Image
            source={{ uri: listing.cover_url }}
            style={styles.coverImage}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <LinearGradient
            colors={[...gradients.card]}
            style={[styles.coverImage, styles.coverFallback]}
          >
            <Ionicons name="home" size={52} color="rgba(255,255,255,0.35)" />
          </LinearGradient>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(7, 17, 32, 0.78)']}
          style={styles.coverFade}
        />

        <View style={styles.pricePill}>
          <Text style={styles.priceText}>{formatPrix(listing.prix)}</Text>
        </View>

        <View style={styles.statePill}>
          <View style={styles.stateDot} />
          <Text style={styles.stateText}>Disponible</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.typeRow}>
          <Text style={styles.type}>{listing.type_name}</Text>
          {listing.has_equip ? (
            <View style={styles.equipPill}>
              <Ionicons name="checkmark-circle" size={13} color={colors.tealDark} />
              <Text style={styles.equipText}>Équipé</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color={colors.textSoft} />
          <Text style={styles.location} numberOfLines={1}>
            {listing.quarter_name} · {listing.town_name}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="resize" size={14} color={colors.textSoft} />
          <Text style={styles.metaText}>{listing.surface} m²</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  cover: {
    height: 158,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 88,
  },
  pricePill: {
    position: 'absolute',
    left: 14,
    bottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.teal,
    shadowColor: colors.navy,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  priceText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  statePill: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(7, 17, 32, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  stateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  stateText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    padding: 14,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  type: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    textTransform: 'capitalize',
    letterSpacing: -0.3,
  },
  equipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  equipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.tealDark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 7,
  },
  location: {
    flex: 1,
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSoft,
    fontWeight: '500',
  },
});