// src/components/AppInput.tsx
import React, { useState, forwardRef, memo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';

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
    const { colors, spacing, radius, typography, fonts } = theme;
    const [isFocused, setIsFocused] = useState(false);
    const [secureVisible, setSecureVisible] = useState(false);

    const borderColor = error
      ? colors.error
      : isFocused
      ? colors.inputFocusBorder
      : colors.inputBorder;

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {/* Label */}
        {label ? (
          <AppText variant="label" secondary mb={6}>
            {label}
          </AppText>
        ) : null}

        {/* Input row */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.inputBg,
              borderColor,
              borderRadius: radius.md,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.base,
            },
          ]}
        >
          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                fontFamily: fonts.regular,
                fontSize: 15,
                lineHeight: 22,
                color: colors.textPrimary,
              },
              style,
            ]}
            placeholderTextColor={colors.inputPlaceholder}
            secureTextEntry={isPassword && !secureVisible}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Right icons */}
          {isPassword ? (
            <TouchableOpacity
              onPress={() => setSecureVisible(v => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {secureVisible ? (
                <Eye size={20} color={colors.textTertiary} />
              ) : (
                <EyeOff size={20} color={colors.textTertiary} />
              )}
            </TouchableOpacity>
          ) : rightIcon ? (
            rightIcon
          ) : null}
        </View>

        {/* Error message */}
        {error ? (
          <AppText variant="caption" error mt={4}>
            {error}
          </AppText>
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
  },
  input: {
    flex: 1,
    padding: 0, // remove default TextInput padding
    margin: 0,
  },
});

AppInput.displayName = 'AppInput';
export default memo(AppInput);
