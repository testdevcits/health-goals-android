import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import styles from '../styles.notification';

export const NotificationEmptyState: React.FC = memo(() => {
  const { theme } = useTheme();
  const { spacing } = theme;

  return (
    <View style={styles.emptyContainer}>
      <AppText variant="display" center>
        🔔
      </AppText>

      <AppText variant="h3" color="textPrimary" center mt={spacing.md}>
        You&apos;re all caught up!
      </AppText>

      <AppText variant="body2" color="textSecondary" center mt={spacing.sm}>
        New notifications will appear here.
      </AppText>
    </View>
  );
});

export default NotificationEmptyState;
