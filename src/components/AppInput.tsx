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
import { useTheme } from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import AppText from './AppText';
import AppIcon from '../assets/appicon/AppIcon';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AppInput = forwardRef<TextInput, AppInputProps>(
  (
    {
      label,
      error,
      containerStyle,
      isPassword = false,
      leftIcon,
      rightIcon,
      style,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const { colors, radius, fonts } = theme;
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
          {leftIcon ? (
            <View
              style={[styles.leftIconContainer, { marginRight: spacing.sm }]}
            >
              {leftIcon}
            </View>
          ) : null}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                fontFamily: fonts.regular,
                fontSize: theme.typography.body1.fontSize,
                lineHeight: theme.typography.body1.lineHeight,
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
                <AppIcon name="Eye" size={20} color={colors.textTertiary} />
              ) : (
                <AppIcon name="EyeOff" size={20} color={colors.textTertiary} />
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
    marginBottom: spacing.base,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  leftIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    padding: 0, // remove default TextInput padding
    margin: 0,
  },
});

AppInput.displayName = 'AppInput';
export default memo(AppInput);
