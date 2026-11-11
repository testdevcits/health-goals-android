import React, { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';
import AppShimmer from './AppShimmer';

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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: 160,
  },
  skeleton: {
    flexGrow: 1,
    width: '100%',
    gap: 16,
  },
  skeletonCard: {
    width: '100%',
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  skeletonText: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    height: 10,
    borderRadius: 5,
  },
  skeletonTitle: {
    width: '72%',
    height: 12,
  },
  skeletonSubtitle: {
    width: '48%',
  },
  skeletonBadge: {
    width: 34,
    height: 18,
    borderRadius: 9,
  },
  skeletonFooter: {
    width: '58%',
    marginTop: 14,
  },
});

export default memo(AppLoader);
