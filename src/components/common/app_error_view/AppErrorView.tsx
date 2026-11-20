import React, { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme/useTheme';
import AppButton from '../AppButton';
import AppText from '../AppText';
import AppIcon from '../../../assets/appicon/AppIcon';
import { styles } from './styles.AppErrorView';

interface AppErrorViewProps {
  title?: string;
  message?: string;
  onRefresh: () => void;
  refreshing?: boolean;
  refreshLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const AppErrorView: React.FC<AppErrorViewProps> = ({
  title = 'Something went wrong',
  message = 'We couldn’t load this content. Check your connection and try again.',
  onRefresh,
  refreshing = false,
  refreshLabel = 'Try again',
  style,
}) => {
  const { theme } = useTheme();
  const { colors, radius, spacing } = theme;

  return (
    <View
      style={[styles.container, { padding: spacing.xl }, style]}
      accessibilityRole="alert"
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.errorLight,
            borderRadius: radius.full,
            marginBottom: spacing.lg,
          },
        ]}
      >
        <AppIcon
          name="CircleAlert"
          size={28}
          color={colors.error}
          strokeWidth={1.8}
        />
      </View>
      <AppText variant="h3" center bold mb={spacing.xs}>
        {title}
      </AppText>
      <AppText
        variant="body2"
        secondary
        center
        style={[styles.message, { marginBottom: spacing.lg }]}
      >
        {message}
      </AppText>
      <AppButton
        title={refreshLabel}
        onPress={onRefresh}
        loading={refreshing}
        disabled={refreshing}
        leftIcon={
          <AppIcon name="RefreshCw" size={17} color={colors.textPrimary} />
        }
        variant="outline"
        style={styles.action}
      />
    </View>
  );
};

export default memo(AppErrorView);
