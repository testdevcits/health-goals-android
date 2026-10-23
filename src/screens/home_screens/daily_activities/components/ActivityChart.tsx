import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createDailyActivityStyles } from '../styles.DailyActivities';

const ticks = ['12 am', '6 am', '12 pm', '6 pm', '(h)'];

const ActivityChart: React.FC<{
  title: string;
  activePeriod: string;
  color: string;
  values: number[];
}> = ({ title, activePeriod, color, values }) => {
  const { theme } = useTheme();
  const styles = createDailyActivityStyles(theme);
  const maxValue = Math.max(...values, 1);

  return (
    <View style={styles.chartSection}>
      <AppText variant="h3" style={styles.chartTitle}>
        {title}
      </AppText>
      <AppText variant="caption" secondary style={styles.chartSubtitle}>
        Most active period: {activePeriod}
      </AppText>
      <View style={[styles.chart, { borderBottomColor: `${color}55` }]}>
        {values.map((value, index) => (
          <View key={`${title}-${index}`} style={styles.chartBarSlot}>
            {value > 0 ? (
              <View
                style={[
                  styles.chartBar,
                  {
                    height: Math.max(3, (value / maxValue) * 86),
                    backgroundColor: color,
                  },
                ]}
              />
            ) : null}
          </View>
        ))}
      </View>
      <View style={styles.chartLabels}>
        {ticks.map(tick => (
          <AppText key={tick} variant="caption" color="textTertiary">
            {tick}
          </AppText>
        ))}
      </View>
    </View>
  );
};

export default ActivityChart;
