// src/theme/index.ts
import { lightColors, darkColors, AppColors } from './colors';
import { typography, TypographyVariant } from './typography';
import { fonts } from './fonts';
import { spacing } from './spacing';
import { radius } from './radius';

export type { AppColors, TypographyVariant };

export type AppTheme = {
  colors: AppColors;
  typography: typeof typography;
  fonts: typeof fonts;
  spacing: typeof spacing;
  radius: typeof radius;
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
