import React from 'react';
import { Pressable, View } from 'react-native';
import { Bell, ChevronLeft } from 'lucide-react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createTrendStyles } from '../styles.DailyActivityTrends';
import { TrendMetric } from '../trendData';

const TrendHeader: React.FC<{
  metric: TrendMetric;
  onBack: () => void;
}> = ({ metric, onBack }) => {
  const { theme } = useTheme();
  const styles = createTrendStyles(theme);

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
      ]}>
      <View style={styles.statusRow}>
        <AppText variant="caption" bold>
          9:41
        </AppText>
        <AppText variant="caption">📶 📡 🔋</AppText>
      </View>
      <View style={styles.headerMain}>
        <Pressable
          onPress={onBack}
          style={[
            styles.headerButton,
            { backgroundColor: theme.colors.backgroundSecondary },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ChevronLeft size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCopy}>
          <AppText variant="h3">
            {metric === 'Heart' ? 'Heart Rate' : metric}
          </AppText>
          <AppText variant="caption" secondary>
            Your last 7 days
          </AppText>
        </View>
        <Pressable
          style={[
            styles.headerButton,
            { backgroundColor: theme.colors.backgroundSecondary },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Notifications">
          <Bell size={19} color={theme.colors.warning} />
        </Pressable>
        <View style={[styles.avatar, { backgroundColor: theme.colors.info }]}>
          <AppText variant="subtitle2" color="white" bold>
            AJ
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default TrendHeader;
