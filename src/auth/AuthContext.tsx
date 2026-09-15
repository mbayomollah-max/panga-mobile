import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Profile } from '../types';
import {
  getProfile,
  getToken,
  signInWithMbayo,
  signOut as doSignOut,
  type SignInResult,
} from './session';

interface AuthContextValue {
  profile: Profile | null;
  token: string | null;
  loading: boolean;
  signIn: () => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  profile: null,
  token: null,
  loading: true,
  signIn: async () => ({ profile: null, reason: 'cancelled' }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await getToken();
        if (stored && !cancelled) {
          const prof = await getProfile(stored);
          if (cancelled) return;
          if (prof) {
            setToken(stored);
            setProfile(prof);
          } else {
            await doSignOut();
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async () => {
    const result = await signInWithMbayo();
    if (result.profile) {
      setToken(await getToken());
      setProfile(result.profile);
    }
    return result;
  };

  const signOut = async () => {
    await doSignOut();
    setToken(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ profile, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}