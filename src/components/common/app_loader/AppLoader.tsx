import React, { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme/useTheme';
import AppShimmer from '../AppShimmer';
import { styles } from './styles.AppLoader';

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
  const cardCount = size === 'small' ? 1 : 3;

  return (
    <View
      style={[styles.container, { padding: theme.spacing.xl }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <AppShimmer style={styles.skeleton}>
        {Array.from({ length: cardCount }, (_, index) => (
          <View
            key={index}
            style={[
              styles.skeletonCard,
              {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                padding: theme.spacing.md,
              },
            ]}
          >
            <View style={styles.skeletonHeader}>
              <View
                style={[
                  styles.skeletonAvatar,
                  { backgroundColor: theme.colors.surfaceElevated },
                ]}
              />
              <View style={styles.skeletonText}>
                <View
                  style={[
                    styles.skeletonLine,
                    styles.skeletonTitle,
                    { backgroundColor: theme.colors.surfaceElevated },
                  ]}
                />
                <View
                  style={[
                    styles.skeletonLine,
                    styles.skeletonSubtitle,
                    { backgroundColor: theme.colors.surfaceElevated },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.skeletonBadge,
                  { backgroundColor: theme.colors.surfaceElevated },
                ]}
              />
            </View>
            <View
              style={[
                styles.skeletonLine,
                styles.skeletonFooter,
                { backgroundColor: theme.colors.surfaceElevated },
              ]}
            />
          </View>
        ))}
      </AppShimmer>
    </View>
  );
};

export default memo(AppLoader);
