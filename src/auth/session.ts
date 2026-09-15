import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { API_BASE_URL } from '../config';
import type { Profile } from '../types';

const TOKEN_KEY = 'panga_access_token';
const REDIRECT_PATH = 'auth';

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

export async function signInWithMbayo(): Promise<Profile | null> {
  const returnTo = AuthSession.makeRedirectUri({
    scheme: 'panga',
    path: REDIRECT_PATH,
  });
  const authorizeUrl = `${API_BASE_URL}/v1/auth/mbayo?return_to=${encodeURIComponent(
    returnTo,
  )}`;
  const result = await WebBrowser.openAuthSessionAsync(authorizeUrl, returnTo);

  if (result.type !== 'success') return null;
  const token = extractTokenFromUrl(result.url);
  if (!token) return null;

  await SecureStore.setItemAsync(TOKEN_KEY, token);
  return getProfile(token);
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

function extractTokenFromUrl(url: string): string | null {
  const match = /[#&]token=([^&]+)/.exec(url);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}