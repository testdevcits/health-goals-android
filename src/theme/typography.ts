// src/theme/typography.ts
import { fonts } from './fonts';

// All text styles use Inter font family with precise size/weight/lineHeight combos.
// These are consumed by AppText via the `variant` prop.
export const typography = {
  // ── Display ────────────────────────────────────
  display: {
    fontFamily: fonts.bold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  // ── Headings ───────────────────────────────────
  h1: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0,
  },
  // ── Subtitles ──────────────────────────────────
  subtitle1: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  subtitle2: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
  // ── Body ───────────────────────────────────────
  body1: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body2: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
  // ── Labels & Captions ─────────────────────────
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  // ── Buttons ────────────────────────────────────
  button: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  buttonSm: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  // ── Links ──────────────────────────────────────
  link: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
};

export type TypographyVariant = keyof typeof typography;
