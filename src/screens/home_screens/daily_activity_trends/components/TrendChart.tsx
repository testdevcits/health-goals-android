import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createTrendStyles } from '../styles.DailyActivityTrends';
import { TrendMetric } from '../trendData';

import { recentHealthDayLabels } from '../../../../utils/healthDates';

const TrendChart: React.FC<{
  metric: TrendMetric;
  data: { color: string; bars: (number | null)[] };
}> = ({ metric, data }) => {
  const { theme } = useTheme();
  const days = recentHealthDayLabels();
  const styles = createTrendStyles(theme);
  const maxValue = Math.max(
    ...data.bars.filter((value): value is number => value !== null),
    1,
  );

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
            Last 7 days
          </AppText>
        </View>
      </View>
      <View style={[styles.chart, { borderBottomColor: theme.colors.border }]}>
        {data.bars.map((value, index) => (
          <View key={days[index]} style={styles.chartColumn}>
            <View
              style={[
                styles.chartBar,
                {
                  height:
                    value !== null && value > 0
                      ? Math.max(2, (value / maxValue) * 110)
                      : 0,
                  backgroundColor: data.color,
                },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.dayLabels}>
        {days.map(day => (
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
