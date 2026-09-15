import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { API_BASE_URL } from '../config';
import type { Profile } from '../types';

const TOKEN_KEY = 'panga_access_token';
// Budget d'interrogation du relais (le serveur expire la session en ~180 s).
const POLL_BUDGET_MS = 150_000;
const POLL_INTERVAL_MS = 900;

export type SignInReason =
  | 'ok'
  | 'cancelled'
  | 'no_token'
  | 'invalid_session'
  | 'network';

export interface SignInResult {
  profile: Profile | null;
  reason: SignInReason;
}

interface DeviceSession {
  code: string;
  authorize_url: string;
  complete_url: string;
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getProfile(token: string): Promise<Profile | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Flux relais (aucun deep link) :
//  1. POST /v1/auth/device  →  code + authorize_url. Le retour OAuth est
//     l'URL https complete_url de l'API (et non un exp://).
//  2. openAuthSessionAsync observe cette URL https dans le navigateur et
//     résout « success » quand le serveur y a posé le jeton (?token=…).
//  3. Relance : polling GET /v1/auth/device/{code} qui consomme le jeton.
export async function signInWithMbayo(): Promise<SignInResult> {
  let device: DeviceSession;
  try {
    const res = await fetch(`${API_BASE_URL}/v1/auth/device`, { method: 'POST' });
    if (!res.ok) return { profile: null, reason: 'network' };
    device = await res.json();
  } catch {
    return { profile: null, reason: 'network' };
  }
  if (!device?.code || !device?.authorize_url || !device?.complete_url) {
    return { profile: null, reason: 'network' };
  }

  let cancelledEarly = false;
  let result: WebBrowser.WebBrowserAuthSessionResult;
  try {
    result = await WebBrowser.openAuthSessionAsync(
      device.authorize_url,
      device.complete_url,
    );
  } catch {
    return { profile: null, reason: 'network' };
  }

  if (result.type === 'success') {
    const token = extractTokenFromUrl(result.url);
    if (token) return await finish(token);
    cancelledEarly = false; // URL reçue mais sûrement sans jeton : on poll
  } else {
    // 'cancel' / 'dismiss' : navigateur refermé. On laisse une fenêtre courte
    // au relais : la connexion a pu aboutir juste avant la fermeture.
    cancelledEarly = true;
  }

  const token = await pollDeviceToken(device.code, cancelledEarly);
  if (!token) return { profile: null, reason: cancelledEarly ? 'cancelled' : 'no_token' };
  return await finish(token);
}

async function finish(token: string): Promise<SignInResult> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  const profile = await getProfile(token);
  if (!profile) return { profile: null, reason: 'invalid_session' };
  return { profile, reason: 'ok' };
}

// Interroge le relais jusqu'à obtention du jeton (usage unique).
async function pollDeviceToken(code: string, cancelledEarly: boolean): Promise<string | null> {
  const budget = cancelledEarly ? Math.min(20_000, POLL_BUDGET_MS) : POLL_BUDGET_MS;
  const start = Date.now();
  while (Date.now() - start < budget) {
    await sleep(POLL_INTERVAL_MS);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/auth/device/${code}`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data?.token === 'string' && data.token) return data.token;
      } else if (res.status === 410) {
        return null;
      }
    } catch {
      // réseau instable : on retente
    }
  }
  return null;
}

export async function signOut(): Promise<void> {
  const token = await getToken();
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/v1/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // la déconnexion locale prime sur le réseau
    }
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// Le jetton arrive en query (?token=…) ET en fragment (#token=…) ; sous
// Android un des deux peut être perdu : on accepte l'un ou l'autre.
function extractTokenFromUrl(url: string): string | null {
  const raw = /(?:[?&]|#)token=([^&#]+)/.exec(url)?.[1] ?? null;
  if (!raw || raw === 'undefined') return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}