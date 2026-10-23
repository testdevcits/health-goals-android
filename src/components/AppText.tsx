// src/components/AppText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { TypographyVariant } from '../theme/index';
import { AppColors } from '../theme/colors';

// Color keys that AppText can reference directly
type ColorKey = keyof AppColors;

interface AppTextProps extends TextProps {
  /** Typography variant from the design system */
  variant?: TypographyVariant;
  /** Semantic color token key from theme.colors */
  color?: ColorKey;
  /** Shorthand: use primary brand color */
  primary?: boolean;
  /** Shorthand: use secondary text color */
  secondary?: boolean;
  /** Shorthand: use error color */
  error?: boolean;
  /** Shorthand: use success color */
  success?: boolean;
  /** Shorthand: use link color */
  link?: boolean;
  /** Center align text */
  center?: boolean;
  /** Right align text */
  right?: boolean;
  /** Bold weight override (uses semiBold font) */
  bold?: boolean;
  /** Medium weight override */
  medium?: boolean;
  /** Custom margin bottom */
  mb?: number;
  /** Custom margin top */
  mt?: number;
  children: React.ReactNode;
}

const AppText: React.FC<AppTextProps> = ({
  variant = 'body1',
  color,
  primary,
  secondary,
  error,
  success,
  link,
  center,
  right,
  bold,
  medium,
  mb,
  mt,
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  const { colors, typography, fonts } = theme;

  // ── Resolve text color ─────────────────────────────────────
  let resolvedColor: string = colors.textPrimary;
  if (color) resolvedColor = colors[color] as string;
  else if (primary) resolvedColor = colors.primary;
  else if (secondary) resolvedColor = colors.textSecondary;
  else if (error) resolvedColor = colors.textError;
  else if (success) resolvedColor = colors.textSuccess;
  else if (link) resolvedColor = colors.textLink;

  // ── Resolve font weight override ───────────────────────────
  let fontOverride: Partial<TextStyle> = {};
  if (bold) fontOverride = { fontFamily: fonts.bold };
  else if (medium) fontOverride = { fontFamily: fonts.medium };

  // ── Resolve alignment ──────────────────────────────────────
  let alignOverride: Partial<TextStyle> = {};
  if (center) alignOverride = { textAlign: 'center' };
  else if (right) alignOverride = { textAlign: 'right' };

  // ── Spacing overrides ─────────────────────────────────────
  const spacingOverride: Partial<TextStyle> = {};
  if (mb !== undefined) spacingOverride.marginBottom = mb;
  if (mt !== undefined) spacingOverride.marginTop = mt;

  return (
    <Text
      style={[
        typography[variant],
        { color: resolvedColor },
        fontOverride,
        alignOverride,
        spacingOverride,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default AppText;
