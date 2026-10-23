import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createTrendStyles } from '../styles.DailyActivityTrends';
import { TrendMetric } from '../trendData';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TrendChart: React.FC<{
  metric: TrendMetric;
  data: { color: string; bars: number[] };
}> = ({ metric, data }) => {
  const { theme } = useTheme();
  const styles = createTrendStyles(theme);
  const maxValue = Math.max(...data.bars, 1);

  return (
    <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.chartHeading}>
        <AppText variant="subtitle2" bold>
          {metric === 'Heart' ? 'Heart Rate' : metric}
        </AppText>
        <View
          style={[
            styles.weekBadge,
            { backgroundColor: theme.colors.primaryLight },
          ]}
        >
          <AppText variant="caption" primary bold>
            This week
          </AppText>
        </View>
      </View>
      <View style={[styles.chart, { borderBottomColor: theme.colors.border }]}>
        {data.bars.map((value, index) => (
          <View key={DAYS[index]} style={styles.chartColumn}>
            <View
              style={[
                styles.chartBar,
                {
                  height: Math.max(12, (value / maxValue) * 110),
                  backgroundColor: data.color,
                },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.dayLabels}>
        {DAYS.map(day => (
          <AppText
            key={day}
            variant="caption"
            color="textSecondary"
            style={styles.dayLabel}
          >
            {day}
          </AppText>
        ))}
      </View>
    </View>
  );
};

export default TrendChart;
