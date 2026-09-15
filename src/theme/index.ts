import { palette } from './palette';
import type { ViewStyle } from 'react-native';

export const colors = {
  primary: palette.teal,
  teal: palette.teal,
  tealBright: palette.tealBright,
  tealDark: palette.tealDark,
  primaryBright: palette.tealBright,
  primaryDark: palette.tealDark,
  primarySoft: palette.softTeal,
  mint: palette.mint,
  cream: palette.cream,
  white: palette.white,
  input: '#F2F4F8',
  background: palette.white,
  surface: palette.white,
  border: palette.border,
  text: palette.ink,
  textMuted: palette.gray,
  textSoft: palette.graySoft,
  textDim: palette.dot,
  accent: palette.gold,
  danger: palette.danger,
  dangerBg: palette.dangerBg,
  success: palette.green,
  navy: palette.navy,
  navyDeep: palette.navyDeep,
  shadow: palette.navy,
  overlay: palette.overlay,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const shadows: Record<'sm' | 'md' | 'lg', ViewStyle> = {
  sm: {
    shadowColor: palette.navy,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: palette.navy,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  lg: {
    shadowColor: palette.navy,
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
};

export const gradients = {
  hero: [palette.navyDeep, '#0E2A3A', palette.tealDark] as const,
  cta: [palette.teal, palette.tealBright] as const,
  card: [palette.navy, palette.navySoft] as const,
  imageOverlay: ['transparent', palette.overlay] as const,
};

export const typography = {
  hero: 54,
  title: 32,
  heading: 22,
  section: 17,
  body: 15,
  caption: 13,
};