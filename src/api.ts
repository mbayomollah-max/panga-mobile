import { API_BASE_URL } from './config';
import type { ListingDetail, PublicHousing } from './types';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Erreur API ${res.status} — ${path}`);
  }
  return res.json() as Promise<T>;
}

export function fetchListings(ville?: string): Promise<PublicHousing[]> {
  const query = ville ? `?ville=${encodeURIComponent(ville)}` : '';
  return getJson<PublicHousing[]>(`/v1/listings${query}`);
}

export function fetchListing(id: string): Promise<ListingDetail> {
  return getJson<ListingDetail>(`/v1/listings/${id}`);
}

export function formatPrix(usd: number): string {
  return `${usd} $ / mois`;
}