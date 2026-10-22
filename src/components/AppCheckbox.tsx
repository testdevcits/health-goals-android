// src/components/AppCheckbox.tsx
import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';

interface AppCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode | string;
  error?: string;
  containerStyle?: ViewStyle;
}

const AppCheckbox: React.FC<AppCheckboxProps> = ({
  checked,
  onChange,
  label,
  error,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const { colors, radius, spacing } = theme;

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={() => onChange(!checked)}
        activeOpacity={0.7}
        style={styles.row}>
        {/* Box */}
        <View
          style={[
            styles.box,
            {
              borderRadius: radius.xs,
              borderColor: error
                ? colors.error
                : checked
                  ? colors.primary
                  : colors.border,
              backgroundColor: checked ? colors.primary : 'transparent',
              borderWidth: 2,
            },
          ]}>
          {checked ? (
            <Check size={12} color={colors.white} strokeWidth={3} />
          ) : null}
        </View>

        {/* Label */}
        {label ? (
          typeof label === 'string' ? (
            <AppText variant="body2" secondary style={styles.labelText}>
              {label}
            </AppText>
          ) : (
            <View style={styles.labelText}>{label}</View>
          )
        ) : null}
      </TouchableOpacity>

      {error ? (
        <AppText variant="caption" error mt={4}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  box: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  labelText: {
    flex: 1,
  },
});

export default AppCheckbox;
