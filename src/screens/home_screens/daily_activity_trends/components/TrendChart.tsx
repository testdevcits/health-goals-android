import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createTrendStyles } from '../styles.DailyActivityTrends';
import { TrendMetric } from '../trendData';

import {
  recentHealthDayLabels,
  recentIstDates,
} from '../../../../utils/healthDates';

const getDayFullLabel = (index: number): string => {
  const dates = recentIstDates();
  const dateStr = dates[index];
  if (!dateStr) return recentHealthDayLabels()[index] || '';
  try {
    const d = new Date(`${dateStr}T00:00:00Z`);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return recentHealthDayLabels()[index] || '';
  }
};

const formatMetricValue = (
  value: number | null,
  metric: TrendMetric,
): string => {
  if (value === null || value === 0) {
    if (metric === 'Steps') return '0 steps';
    if (metric === 'Sleep') return '0h 0m';
    if (metric === 'Heart') return '0 bpm';
    return '0 mins';
  }
  if (metric === 'Steps') return `${value.toLocaleString()} steps`;
  if (metric === 'Sleep') {
    const hours = Math.floor(value / 60);
    const mins = Math.round(value % 60);
    return `${hours}h ${mins}m`;
  }
  if (metric === 'Heart') return `${value} bpm`;
  return `${value.toLocaleString()} mins`;
};

const formatShortTooltipValue = (
  value: number | null,
  metric: TrendMetric,
): string => {
  if (value === null || value === 0) return '0';
  if (metric === 'Steps') {
    if (value >= 1000) {
      const k = (value / 1000)
        .toFixed(value >= 10000 ? 0 : 1)
        .replace(/\.0$/, '');
      return `${k}k`;
    }
    return value.toLocaleString();
  }
  if (metric === 'Sleep') {
    const hours = Math.floor(value / 60);
    const mins = Math.round(value % 60);
    return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
  }
  if (metric === 'Heart') return `${value}`;
  return `${value}m`;
};

const TrendChart: React.FC<{
  metric: TrendMetric;
  data: { color: string; bars: (number | null)[] };
}> = ({ metric, data }) => {
  const { theme } = useTheme();
  const days = recentHealthDayLabels();
  const styles = createTrendStyles(theme);
  const [selectedIndex, setSelectedIndex] = useState<number>(6);
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
            {
              backgroundColor: `${data.color}1F`,
              borderColor: data.color,
              borderWidth: 1,
            },
          ]}
        >
          <AppText variant="caption" bold style={{ color: data.color }}>
            {getDayFullLabel(selectedIndex)}:{' '}
            {formatMetricValue(data.bars[selectedIndex], metric)}
          </AppText>
        </View>
      </View>
      <View style={[styles.chart, { borderBottomColor: theme.colors.border }]}>
        {data.bars.map((value, index) => {
          const isSelected = selectedIndex === index;
          return (
            <TouchableOpacity
              key={days[index]}
              activeOpacity={0.7}
              onPress={() => setSelectedIndex(index)}
              style={styles.chartColumn}
              accessibilityRole="button"
              accessibilityLabel={`${days[index]}: ${formatMetricValue(value, metric)}`}
            >
              {isSelected && (
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: data.color,
                    backgroundColor: theme.colors.surfaceElevated,
                    zIndex: 10,
                    elevation: 3,
                    shadowColor: theme.colors.black,
                    shadowOpacity: 0.15,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                  }}
                >
                  <AppText
                    variant="caption"
                    bold
                    style={{ fontSize: 10, color: data.color }}
                  >
                    {formatShortTooltipValue(value, metric)}
                  </AppText>
                </View>
              )}
              <View
                style={[
                  styles.chartBar,
                  {
                    height:
                      value !== null && value > 0
                        ? Math.max(4, (value / maxValue) * 95)
                        : 4,
                    backgroundColor: data.color,
                    borderRadius: 4,
                  },
                  isSelected
                    ? {
                        opacity: 1,
                        borderWidth: 1.5,
                        borderColor: theme.colors.surface,
                        elevation: 4,
                        shadowColor: data.color,
                        shadowOpacity: 0.35,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 2 },
                      }
                    : { opacity: 0.45 },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.dayLabels}>
        {days.map((day, index) => {
          const isSelected = selectedIndex === index;
          return (
            <AppText
              key={day}
              variant="caption"
              bold={isSelected}
              color={isSelected ? undefined : 'textSecondary'}
              style={[
                styles.dayLabel,
                isSelected ? { color: data.color } : undefined,
              ]}
              onPress={() => setSelectedIndex(index)}
            >
              {day}
            </AppText>
          );
        })}
      </View>
    </View>
  );
};

export default TrendChart;
