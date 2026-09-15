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

export async function createRequest(
  token: string,
  housingId: string,
  guarantee: number,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/v1/card`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ housing_id: housingId, guarantee }),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('session');
    throw new Error('La demande n\'a pas pu être enregistrée.');
  }
}

export function formatPrix(usd: number): string {
  return `${usd} $ / mois`;
}