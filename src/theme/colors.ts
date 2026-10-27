// src/theme/colors.ts

export const lightColors = {
  // ── Brand ─────────────────────────────────────────────────
  primary: '#00C6A2',
  primaryDark: '#009E82',
  primaryLight: '#E0FAF5',

  // ── Semantic backgrounds ───────────────────────────────────
  background: '#FFFFFF',
  backgroundSecondary: '#F6F8FB',
  surface: '#FFFFFF',
  surfaceElevated: '#F0F4FA',

  // ── Text ──────────────────────────────────────────────────
  textPrimary: '#1A1F36',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#00C6A2',
  textError: '#E53E3E',
  textSuccess: '#10B981',

  // ── Input ─────────────────────────────────────────────────
  inputBg: '#F4F6F8',
  inputBorder: '#E2E8F0',
  inputFocusBorder: '#00C6A2',
  inputPlaceholder: '#9CA3AF',

  // ── Borders / Dividers ────────────────────────────────────
  border: '#E2E8F0',
  divider: '#F1F5F9',

  // ── Status ────────────────────────────────────────────────
  error: '#E53E3E',
  errorLight: '#FEF2F2',
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  info: '#3B82F6',
  infoLight: '#EFF6FF',

  // ── Brand accents ─────────────────────────────────────────
  coral: '#FF8278',
  coralLight: '#FFE9E5',

  // ── Misc ──────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.45)',

  // ── Gradient stops ────────────────────────────────────────
  gradientStart: '#00D2AA',
  gradientMid: '#0099CC',
  gradientEnd: '#5B6BF5',
};

export const darkColors = {
  // ── Brand ─────────────────────────────────────────────────
  primary: '#00C6A2',
  primaryDark: '#009E82',
  primaryLight: '#003D34',

  // ── Semantic backgrounds ───────────────────────────────────
  background: '#0D1117',
  backgroundSecondary: '#161B22',
  surface: '#161B22',
  surfaceElevated: '#21262D',

  // ── Text ──────────────────────────────────────────────────
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  textTertiary: '#6E7681',
  textInverse: '#0D1117',
  textLink: '#00C6A2',
  textError: '#F87171',
  textSuccess: '#34D399',

  // ── Input ─────────────────────────────────────────────────
  inputBg: '#21262D',
  inputBorder: '#30363D',
  inputFocusBorder: '#00C6A2',
  inputPlaceholder: '#6E7681',

  // ── Borders / Dividers ────────────────────────────────────
  border: '#30363D',
  divider: '#21262D',

  // ── Status ────────────────────────────────────────────────
  error: '#F87171',
  errorLight: '#2D0A0A',
  success: '#34D399',
  successLight: '#0A2D1F',
  warning: '#FBBF24',
  warningLight: '#2D1F0A',
  info: '#60A5FA',
  infoLight: '#0A1A2D',

  // ── Brand accents ─────────────────────────────────────────
  coral: '#FF8278',
  coralLight: '#FFE9E5',

  // ── Misc ──────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.6)',

  // ── Gradient stops ────────────────────────────────────────
  gradientStart: '#00D2AA',
  gradientMid: '#0099CC',
  gradientEnd: '#5B6BF5',
};

export type AppColors = typeof lightColors;
