// src/components/AppInput.tsx
import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
  rightIcon?: React.ReactNode;
}

const AppInput = forwardRef<TextInput, AppInputProps>(
  (
    {
      label,
      error,
      containerStyle,
      isPassword = false,
      rightIcon,
      style,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const { colors, spacing, radius, typography } = theme;
    const [isFocused, setIsFocused] = useState(false);
    const [secureVisible, setSecureVisible] = useState(false);

    const borderColor = error
      ? colors.error
      : isFocused
        ? colors.primary
        : colors.border;

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {label ? (
          <Text
            style={[
              typography.label,
              { color: colors.textSecondary, marginBottom: spacing.xs },
            ]}>
            {label}
          </Text>
        ) : null}

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.inputBg,
              borderColor,
              borderRadius: radius.md,
            },
          ]}>
          <TextInput
            ref={ref}
            style={[
              styles.input,
              typography.body1,
              {
                color: colors.textPrimary,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.base,
              },
              style,
            ]}
            placeholderTextColor={colors.placeholder}
            secureTextEntry={isPassword && !secureVisible}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Password eye toggle */}
          {isPassword ? (
            <TouchableOpacity
              onPress={() => setSecureVisible(v => !v)}
              style={styles.rightIcon}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              {secureVisible ? (
                <Eye size={20} color={colors.textSecondary} />
              ) : (
                <EyeOff size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          ) : rightIcon ? (
            <View style={styles.rightIcon}>{rightIcon}</View>
          ) : null}
        </View>

        {error ? (
          <Text
            style={[
              typography.caption,
              { color: colors.error, marginTop: spacing.xs },
            ]}>
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
  },
  rightIcon: {
    paddingHorizontal: 14,
  },
});

AppInput.displayName = 'AppInput';
export default AppInput;
