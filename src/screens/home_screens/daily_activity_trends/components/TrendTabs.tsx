import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createTrendStyles } from '../styles.DailyActivityTrends';
import { TREND_METRICS, TrendMetric } from '../trendData';

const TrendTabs: React.FC<{
  activeMetric: TrendMetric;
  onSelect: (metric: TrendMetric) => void;
}> = ({ activeMetric, onSelect }) => {
  const { theme } = useTheme();
  const styles = createTrendStyles(theme);

  return (
    <View
      style={[
        styles.tabs,
        { backgroundColor: theme.colors.surfaceElevated },
      ]}>
      {TREND_METRICS.map(metric => {
        const selected = metric === activeMetric;
        return (
          <Pressable
            key={metric}
            onPress={() => onSelect(metric)}
            style={[
              styles.tab,
              selected && [
                styles.selectedTab,
                { backgroundColor: theme.colors.surface },
              ],
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}>
            <AppText
              variant="label"
              bold={selected}
              color={selected ? 'textPrimary' : 'textTertiary'}>
              {metric}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

export default TrendTabs;
