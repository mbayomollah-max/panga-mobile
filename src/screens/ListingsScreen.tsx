import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListingCard from '../components/ListingCard';
import type { RootStackParamList } from '../navigation/types';
import { fetchListings } from '../api';
import { colors, gradients, radius, shadows } from '../theme';
import type { PublicHousing } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Listings'>;

const ALL = '';

export default function ListingsScreen({ navigation }: Props) {
  const [listings, setListings] = useState<PublicHousing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ville, setVille] = useState(ALL);

  const load = useCallback(async (v: string, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      setListings(await fetchListings(v));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger les logements.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(ALL);
  }, [load]);

  const towns = useMemo(
    () => Array.from(new Set(listings.map((l) => l.town_name).filter(Boolean))),
    [listings],
  );

  const onGoto = (v: string) => {
    setVille(v);
    load(v);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <LinearGradient
          colors={[...gradients.hero]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.brand}>
              <View style={styles.brandMark}>
                <Ionicons name="home" size={15} color={colors.navyDeep} />
              </View>
              <View>
                <Text style={styles.brandTitle}>Panga</Text>
                <Text style={styles.brandSub}>Logements disponibles</Text>
              </View>
            </View>
          </View>

          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.textSoft} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une ville…"
              placeholderTextColor={colors.textSoft}
              value={ville === ALL ? '' : ville}
              onChangeText={(t) => onGoto(t.trim())}
              onSubmitEditing={() => load(ville)}
              returnKeyType="search"
            />
            {ville !== ALL ? (
              <TouchableOpacity onPress={() => onGoto(ALL)} hitSlop={10}>
                <Ionicons name="close-circle" size={18} color={colors.textSoft} />
              </TouchableOpacity>
            ) : null}
          </View>
        </LinearGradient>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Chargement…</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => load(ville)}>
              <Text style={styles.retry}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={listings}
            keyExtractor={(item) => item.housing_id}
            renderItem={({ item }) => (
              <ListingCard
                listing={item}
                onPress={(id) => navigation.navigate('ListingDetail', { id })}
              />
            )}
            ListHeaderComponent={
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                <TouchableOpacity
                  style={[styles.chip, ville === ALL && styles.chipActive]}
                  onPress={() => onGoto(ALL)}
                >
                  <Text
                    style={[styles.chipText, ville === ALL && styles.chipTextActive]}
                  >
                    Tous
                  </Text>
                </TouchableOpacity>
                {towns.map((town) => (
                  <TouchableOpacity
                    key={town}
                    style={[styles.chip, ville === town && styles.chipActive]}
                    onPress={() => onGoto(town)}
                  >
                    <Text
                      style={[styles.chipText, ville === town && styles.chipTextActive]}
                    >
                      {town}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="search" size={42} color={colors.textDim} />
                <Text style={styles.emptyText}>Aucun logement trouvé.</Text>
              </View>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.list}
          />
        )}
      </SafeAreaView>
    </View>
  );

  function onRefresh() {
    setRefreshing(true);
    load(ville);
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -1,
    color: colors.white,
  },
  brandSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  search: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    height: 52,
    ...(shadows.md as object),
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  list: {
    paddingBottom: 28,
  },
  chipsRow: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 4,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.white,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.textMuted,
  },
  errorBox: {
    margin: 16,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerBg,
  },
  errorText: {
    color: colors.danger,
  },
  retry: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 48,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
  },
});