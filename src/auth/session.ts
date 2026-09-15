import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { API_BASE_URL } from '../config';
import type { Profile } from '../types';

const TOKEN_KEY = 'panga_access_token';
const REDIRECT_PATH = 'auth';

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

export async function signInWithMbayo(): Promise<SignInResult> {
  const returnTo = AuthSession.makeRedirectUri({
    scheme: 'panga',
    path: REDIRECT_PATH,
  });
  const authorizeUrl = `${API_BASE_URL}/v1/auth/mbayo?return_to=${encodeURIComponent(
    returnTo,
  )}`;

  let result: WebBrowser.WebBrowserAuthSessionResult;
  try {
    result = await WebBrowser.openAuthSessionAsync(authorizeUrl, returnTo);
  } catch {
    return { profile: null, reason: 'network' };
  }

  if (result.type !== 'success') return { profile: null, reason: 'cancelled' };

  const token = extractTokenFromUrl(result.url);
  if (!token) return { profile: null, reason: 'no_token' };

  await SecureStore.setItemAsync(TOKEN_KEY, token);
  const profile = await getProfile(token);
  return { profile, reason: profile ? 'ok' : 'invalid_session' };
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

// Le jeton arrive dans la query (?) et le fragment (#) en double : sous
// Android l'un ou l'autre peut être perdu au passage Custom Tab → app.
function extractTokenFromUrl(url: string): string | null {
  const raw =
    /(?:[?&]|#)token=([^&#]+)/.exec(url)?.[1] ?? null;
  if (!raw || raw === 'undefined') return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}