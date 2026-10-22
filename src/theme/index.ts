// src/theme/index.ts
import { lightColors, darkColors } from './colors';
import { typography } from './typography';
import { fonts } from './fonts';
import { spacing } from './spacing';
import { radius } from './radius';

export type AppColors = typeof lightColors;
export type AppTypography = typeof typography;
export type AppFonts = typeof fonts;
export type AppSpacing = typeof spacing;
export type AppRadius = typeof radius;

export type AppTheme = {
  colors: AppColors;
  typography: AppTypography;
  fonts: AppFonts;
  spacing: AppSpacing;
  radius: AppRadius;
  isDark: boolean;
};

export const lightTheme: AppTheme = {
  colors: lightColors,
  typography,
  fonts,
  spacing,
  radius,
  isDark: false,
};

export const darkTheme: AppTheme = {
  colors: darkColors,
  typography,
  fonts,
  spacing,
  radius,
  isDark: true,
};
