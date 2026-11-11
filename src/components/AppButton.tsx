// src/components/AppButton.tsx
import React, { memo } from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  View,
} from 'react-native';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';

type Variant = 'primary' | 'outline' | 'ghost';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  leftIcon,
  rightIcon,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const containerStyle: ViewStyle = {
    borderRadius: radius.full,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: disabled ? 0.5 : 1,
    ...(isPrimary && {
      backgroundColor: colors.primary,
    }),
    ...(isOutline && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.border,
    }),
    ...(isGhost && {
      backgroundColor: 'transparent',
    }),
  };

  // Text color per variant
  const textColor = isPrimary
    ? 'textInverse'
    : isOutline
    ? 'textPrimary'
    : 'textLink';

  const spinnerColor = isPrimary
    ? colors.textInverse
    : isOutline
    ? colors.textPrimary
    : colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[containerStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size={26} />
      ) : (
        <>
          {leftIcon ? <View style={{ marginRight: 8 }}>{leftIcon}</View> : null}
          <AppText variant="button" color={textColor as any}>
            {title}
          </AppText>
          {rightIcon ? (
            <View style={{ marginLeft: 8 }}>{rightIcon}</View>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
};

export default memo(AppButton);
