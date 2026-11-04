import React, { memo } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';

interface AppLoaderProps {
  message?: string;
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
}

const AppLoader: React.FC<AppLoaderProps> = ({
  message = 'Loading…',
  size = 'large',
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { padding: theme.spacing.xl }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator
        size={size}
        color={theme.colors.primary}
        accessibilityIgnoresInvertColors
      />
      {message ? (
        <AppText
          variant="body2"
          secondary
          style={{ marginTop: theme.spacing.md }}
        >
          {message}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(AppLoader);
