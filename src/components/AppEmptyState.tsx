import React, { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';
import AppButton from './AppButton';
import AppText from './AppText';
import AppIcon from '../assets/appicon/AppIcon';

interface AppEmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

const AppEmptyState: React.FC<AppEmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  style,
}) => {
  const { theme } = useTheme();
  const { colors, radius, spacing } = theme;

  return (
    <View style={[styles.container, { padding: spacing.xl }, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.primaryLight,
            borderRadius: radius.full,
            marginBottom: spacing.lg,
          },
        ]}
      >
        {icon ?? (
          <AppIcon
            name="Inbox"
            size={28}
            color={colors.primary}
            strokeWidth={1.8}
          />
        )}
      </View>
      <AppText variant="h3" center bold mb={spacing.xs}>
        {title}
      </AppText>
      {description ? (
        <AppText
          variant="body2"
          secondary
          center
          style={[styles.description, { marginBottom: spacing.lg }]}
        >
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          style={styles.action}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    maxWidth: 300,
    lineHeight: 22,
  },
  action: {
    minWidth: 140,
  },
});

export default memo(AppEmptyState);
