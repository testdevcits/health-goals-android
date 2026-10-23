import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createDailyActivityStyles } from '../styles.DailyActivities';

const metrics = [
  { title: 'Steps', value: '2,038', goal: '/ 6,000', color: '#B9C92D' },
  { title: 'Active time', value: '21', unit: 'mins', goal: '/ 90', color: '#42C9D9' },
  { title: 'Activity cals', value: '70', unit: 'kcal', goal: '/ 500', color: '#B23CC2' },
];

const ActivityMetrics: React.FC = () => {
  const { theme } = useTheme();
  const styles = createDailyActivityStyles(theme);

  return (
    <View style={styles.metricRow}>
      {metrics.map(metric => (
        <View
          key={metric.title}
          style={[
            styles.metricCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <AppText variant="caption" style={{ color: metric.color }}>
            {metric.title}
          </AppText>
          <AppText variant="h3">
            {metric.value}
            {metric.unit ? (
              <AppText variant="caption" secondary>
                {' '}{metric.unit}
              </AppText>
            ) : null}
          </AppText>
          <AppText variant="caption" secondary style={styles.metricGoal}>
            {metric.goal}
          </AppText>
        </View>
      ))}
    </View>
  );
};

export default ActivityMetrics;
