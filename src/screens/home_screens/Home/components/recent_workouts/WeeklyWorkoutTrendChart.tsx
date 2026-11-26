import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import {
  recentHealthDayLabels,
  recentIstDates,
} from '../../../../../utils/healthDates';
import type { GroupedActivityItem } from './useRecentWorkouts';

export interface DayWorkoutStat {
  dateKey: string;
  dayLabel: string;
  durationMins: number;
  calories: number;
  workoutCount: number;
}

interface WeeklyWorkoutTrendChartProps {
  groupedActivities: GroupedActivityItem[];
  selectedDateKey: string | null;
  onSelectDate: (dateKey: string | null) => void;
}

const BAR_MAX_HEIGHT = 64;

export const WeeklyWorkoutTrendChart: React.FC<
  WeeklyWorkoutTrendChartProps
> = ({ groupedActivities, selectedDateKey, onSelectDate }) => {
  const { theme } = useTheme();
  const { colors, radius } = theme;
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(
    null,
  );

  const dates = recentIstDates();
  const labels = recentHealthDayLabels();

  // Aggregate workout volume per day for past 7 days
  const weeklyData: DayWorkoutStat[] = dates.map((dateKey, index) => {
    let durationMins = 0;
    let calories = 0;
    let workoutCount = 0;

    for (const group of groupedActivities) {
      if (group.dateKey === dateKey) {
        if (group.isWorkout) {
          durationMins += group.totalDurationMin;
          calories += group.totalCalories;
          workoutCount += group.sessions.length;
        } else if (group.metricType === 'active_minutes') {
          if (durationMins === 0) {
            durationMins = group.totalDurationMin;
          }
        }
      }
    }

    return {
      dateKey,
      dayLabel: labels[index] || '',
      durationMins: Math.round(durationMins),
      calories: Math.round(calories),
      workoutCount,
    };
  });

  const maxDuration = Math.max(...weeklyData.map(d => d.durationMins), 30);
  const totalWeeklyMins = weeklyData.reduce(
    (acc, curr) => acc + curr.durationMins,
    0,
  );
  const totalWeeklyCals = weeklyData.reduce(
    (acc, curr) => acc + curr.calories,
    0,
  );

  const handleBarPress = (index: number, dateKey: string) => {
    if (selectedDateKey === dateKey) {
      onSelectDate(null);
      setActiveTooltipIndex(null);
    } else {
      onSelectDate(dateKey);
      setActiveTooltipIndex(index);
    }
  };

  const selectedStat =
    activeTooltipIndex !== null ? weeklyData[activeTooltipIndex] : null;

  return (
    <View
      style={[
        chartStyles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.xl,
        },
      ]}
    >
      {/* Header Info */}
      <View style={chartStyles.headerRow}>
        <View>
          <AppText variant="caption" secondary bold>
            7-Day Activity Volume
          </AppText>
          <AppText variant="subtitle2" bold color="textPrimary" mt={2}>
            {totalWeeklyMins > 0
              ? `${Math.floor(totalWeeklyMins / 60)}h ${
                  totalWeeklyMins % 60
                }m Active`
              : 'No workouts this week'}
          </AppText>
        </View>

        <View style={chartStyles.statsBadge}>
          {totalWeeklyCals > 0 ? (
            <View
              style={[
                chartStyles.pill,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <AppText variant="caption">🔥</AppText>
              <AppText variant="caption" bold style={{ color: colors.warning }}>
                {totalWeeklyCals.toLocaleString()} kcal
              </AppText>
            </View>
          ) : null}
          {selectedDateKey ? (
            <Pressable
              onPress={() => {
                onSelectDate(null);
                setActiveTooltipIndex(null);
              }}
              style={[
                chartStyles.clearFilterBtn,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <AppText variant="caption" bold color="primary">
                Clear
              </AppText>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Dynamic Tooltip Banner if selected */}
      {selectedStat ? (
        <View
          style={[
            chartStyles.tooltipBanner,
            {
              backgroundColor: colors.primaryLight,
              borderColor: colors.primary,
            },
          ]}
        >
          <AppText variant="caption" bold color="primary">
            {selectedStat.dayLabel}: {selectedStat.durationMins}m
            {selectedStat.calories > 0
              ? ` • ${selectedStat.calories} kcal`
              : ''}
            {selectedStat.workoutCount > 0
              ? ` (${selectedStat.workoutCount} sessions)`
              : ''}
          </AppText>
          <AppText variant="caption" secondary>
            Filtering list below
          </AppText>
        </View>
      ) : null}

      {/* Interactive Bar Chart Strip */}
      <View style={chartStyles.barsRow}>
        {weeklyData.map((stat, index) => {
          const isSelected = selectedDateKey === stat.dateKey;
          const isToday = index === weeklyData.length - 1;
          const heightPct = Math.max(
            0.08,
            Math.min(1, stat.durationMins / maxDuration),
          );
          const barHeight = Math.round(heightPct * BAR_MAX_HEIGHT);

          return (
            <Pressable
              key={stat.dateKey}
              onPress={() => handleBarPress(index, stat.dateKey)}
              style={chartStyles.barColumn}
            >
              {/* Tooltip text above active bar */}
              <View style={chartStyles.topLabelContainer}>
                {stat.durationMins > 0 ? (
                  <AppText
                    variant="caption"
                    style={{
                      fontSize: 10,
                      color: isSelected ? colors.primary : colors.textSecondary,
                    }}
                    bold={isSelected}
                  >
                    {stat.durationMins}m
                  </AppText>
                ) : null}
              </View>

              {/* Bar Track + Fill */}
              <View
                style={[
                  chartStyles.barTrack,
                  {
                    height: BAR_MAX_HEIGHT,
                    backgroundColor: colors.backgroundSecondary,
                  },
                ]}
              >
                <View
                  style={[
                    chartStyles.barFill,
                    {
                      height: barHeight,
                      backgroundColor: isSelected
                        ? colors.primary
                        : stat.durationMins > 0
                        ? isToday
                          ? colors.primary
                          : colors.primaryLight
                        : 'transparent',
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                    },
                  ]}
                />
              </View>

              {/* Day Label Below */}
              <View
                style={[
                  chartStyles.dayLabelBadge,
                  isToday && {
                    backgroundColor: colors.primaryLight,
                    borderRadius: 4,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  bold={isSelected || isToday}
                  color={isSelected || isToday ? 'primary' : 'textSecondary'}
                  style={{ fontSize: 11 }}
                >
                  {stat.dayLabel}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const chartStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  clearFilterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tooltipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  topLabelContainer: {
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
  },
  dayLabelBadge: {
    marginTop: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: 'center',
  },
});
