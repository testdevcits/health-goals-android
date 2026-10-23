import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createTrendStyles } from '../styles.DailyActivityTrends';
import { TrendMetric } from '../trendData';

type TrendStat = {
  value: string;
  label: string;
};

const TrendStats: React.FC<{
  metric: TrendMetric;
  stats: TrendStat[];
}> = ({ metric, stats }) => {
  const { theme } = useTheme();
  const styles = createTrendStyles(theme);

  return (
    <View
      style={styles.statsGrid}
      accessibilityLabel={`${metric} weekly summary`}
    >
      {stats.map(stat => (
        <View
          key={stat.label}
          style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
        >
          <AppText variant="h2" bold>
            {stat.value}
          </AppText>
          <AppText variant="caption" secondary>
            {stat.label}
          </AppText>
        </View>
      ))}
    </View>
  );
};

export default TrendStats;
