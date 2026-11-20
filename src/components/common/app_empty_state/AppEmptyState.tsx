import React, { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme/useTheme';
import AppButton from '../AppButton';
import AppText from '../AppText';
import AppIcon from '../../../assets/appicon/AppIcon';
import { styles } from './styles.AppEmptyState';

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

export default memo(AppEmptyState);
