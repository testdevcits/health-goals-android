// src/components/AppButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme/useTheme';

type Variant = 'primary' | 'outline' | 'ghost';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius, typography } = theme;

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  const containerStyle: ViewStyle = {
    borderRadius: radius.full,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    opacity: disabled ? 0.55 : 1,
    ...(isPrimary && { backgroundColor: colors.primary }),
    ...(isOutline && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.border,
    }),
    ...(variant === 'ghost' && { backgroundColor: 'transparent' }),
  };

  const labelColor = isPrimary
    ? colors.white
    : variant === 'outline'
      ? colors.textPrimary
      : colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[containerStyle, style]}>
      {loading ? (
        <ActivityIndicator color={labelColor} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[typography.button, { color: labelColor }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
