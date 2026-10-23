import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createDailyActivityStyles } from '../styles.DailyActivities';

const ActivityMetrics: React.FC<{ metrics: any[] }> = ({ metrics }) => {
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
          ]}
        >
          <AppText variant="caption" style={{ color: metric.color }}>
            {metric.title}
          </AppText>
          <AppText variant="h3">
            {metric.value}
            {metric.unit ? (
              <AppText variant="caption" secondary>
                {' '}
                {metric.unit}
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

export default memo(ActivityMetrics);
