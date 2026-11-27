import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Polyline,
  Stop,
} from 'react-native-svg';
import { AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import { recentIstDates } from '../../../../../utils/healthDates';
import type { GroupedActivityItem } from './useRecentWorkouts';

interface WeeklyWorkoutTrendChartProps {
  groupedActivities: GroupedActivityItem[];
  selectedDateKey: string | null;
  onSelectDate: (dateKey: string | null) => void;
}

type MetricKey = 'steps' | 'calories' | 'active_minutes' | 'distance';

interface SectionConfig {
  key: MetricKey;
  title: string;
  color: string;
  formatValue: (value: number) => string;
}

interface DayMetricPoint {
  dateKey: string;
  dayLabel: string;
  value: number;
}

const CHART_HEIGHT = 76;
const CHART_PAD_X = 14;
const CHART_PAD_TOP = 10;
const CHART_PAD_BOTTOM = 8;

const SECTIONS: SectionConfig[] = [
  {
    key: 'steps',
    title: 'Steps',
    color: '#10B981',
    formatValue: v => `${Math.round(v).toLocaleString('en-US')} steps`,
  },
  {
    key: 'calories',
    title: 'Calories Burned',
    color: '#F97316',
    formatValue: v => `${Math.round(v).toLocaleString('en-US')} kcal`,
  },
  {
    key: 'active_minutes',
    title: 'Active Minutes',
    color: '#3B82F6',
    formatValue: v => `${Math.round(v)} min`,
  },
  {
    key: 'distance',
    title: 'Distance',
    color: '#8B5CF6',
    formatValue: v => `${v.toFixed(2)} km`,
  },
];

const getShortWeekday = (dateKey: string) =>
  new Date(`${dateKey}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: 'UTC',
  });

const extractDailyMetric = (
  groupedActivities: GroupedActivityItem[],
  dateKey: string,
  metric: MetricKey,
): number => {
  let dailyVal = 0;
  let workoutFallback = 0;

  for (const group of groupedActivities) {
    if (group.dateKey !== dateKey) continue;

    if (
      metric === 'steps' &&
      !group.isWorkout &&
      group.metricType === 'steps'
    ) {
      dailyVal += group.totalDurationMin;
    } else if (metric === 'calories') {
      if (!group.isWorkout && group.metricType === 'calories') {
        dailyVal += group.totalDurationMin;
      } else if (group.isWorkout) {
        workoutFallback += group.totalCalories;
      }
    } else if (metric === 'active_minutes') {
      if (group.isWorkout) {
        workoutFallback += group.totalDurationMin;
      } else if (group.metricType === 'active_minutes') {
        dailyVal += group.totalDurationMin;
      }
    } else if (metric === 'distance') {
      if (!group.isWorkout && group.metricType === 'distance') {
        dailyVal += group.totalDurationMin;
      } else if (group.isWorkout) {
        workoutFallback += group.totalDistanceKm;
      }
    }
  }

  if (metric === 'active_minutes') {
    return workoutFallback > 0 ? workoutFallback : dailyVal;
  }
  return dailyVal > 0 ? dailyVal : workoutFallback;
};

interface SectionAreaCardProps {
  section: SectionConfig;
  currentWeek: DayMetricPoint[];
  previousTotal: number;
  selectedDateKey: string | null;
  onSelectDate: (dateKey: string | null) => void;
}

const SectionAreaCard: React.FC<SectionAreaCardProps> = ({
  section,
  currentWeek,
  previousTotal,
  selectedDateKey,
  onSelectDate,
}) => {
  const { theme } = useTheme();
  const { colors, radius } = theme;
  const [chartWidth, setChartWidth] = useState(280);

  const currentTotal = useMemo(
    () => currentWeek.reduce((sum, item) => sum + item.value, 0),
    [currentWeek],
  );

  const maxValue = useMemo(
    () => Math.max(...currentWeek.map(item => item.value), 1),
    [currentWeek],
  );

  const deltaInfo = useMemo(() => {
    if (previousTotal <= 0 && currentTotal <= 0) {
      return { text: 'No data yet', arrow: '' };
    }
    if (previousTotal <= 0) {
      return { text: '100% vs previous week', arrow: '↑ ' };
    }
    const pct = Math.round(
      ((currentTotal - previousTotal) / previousTotal) * 100,
    );
    if (pct > 0) {
      return { text: `${pct}% vs previous week`, arrow: '↑ ' };
    }
    if (pct < 0) {
      return { text: `${Math.abs(pct)}% vs previous week`, arrow: '↓ ' };
    }
    return { text: '0% vs previous week', arrow: '' };
  }, [currentTotal, previousTotal]);

  const points = useMemo(() => {
    const usableWidth = Math.max(40, chartWidth - CHART_PAD_X * 2);
    const usableHeight = CHART_HEIGHT - CHART_PAD_TOP - CHART_PAD_BOTTOM;
    const stepX =
      currentWeek.length > 1 ? usableWidth / (currentWeek.length - 1) : 0;

    return currentWeek.map((item, idx) => {
      const x = CHART_PAD_X + idx * stepX;
      const ratio = item.value > 0 ? item.value / maxValue : 0;
      const y = CHART_PAD_TOP + usableHeight * (1 - ratio);
      return { x, y, ...item };
    });
  }, [chartWidth, currentWeek, maxValue]);

  const polylinePoints = useMemo(
    () => points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
    [points],
  );

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const bottomY = CHART_HEIGHT - CHART_PAD_BOTTOM;
    const first = points[0];
    const last = points[points.length - 1];
    const lineSegments = points
      .map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
    return `M ${first.x.toFixed(
      1,
    )} ${bottomY} ${lineSegments} L ${last.x.toFixed(1)} ${bottomY} Z`;
  }, [points]);

  const selectedPoint = useMemo(
    () => points.find(p => p.dateKey === selectedDateKey) ?? null,
    [points, selectedDateKey],
  );

  const gradientId = `grad_${section.key}`;

  return (
    <View
      style={[
        chartStyles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.xl,
          shadowColor: colors.black,
        },
      ]}
    >
      {/* Card Header */}
      <View style={chartStyles.cardHeader}>
        <View style={chartStyles.titleWrap}>
          <AppText variant="caption" secondary bold>
            {section.title}
          </AppText>
          <AppText variant="subtitle2" bold color="textPrimary">
            {selectedPoint
              ? `${selectedPoint.dayLabel}: ${section.formatValue(
                  selectedPoint.value,
                )}`
              : section.formatValue(currentTotal)}
          </AppText>
        </View>

        <View style={chartStyles.deltaWrap}>
          <AppText variant="caption" bold style={{ color: section.color }}>
            {deltaInfo.arrow}
            {deltaInfo.text}
          </AppText>
        </View>
      </View>

      {/* SVG Area + Line Chart */}
      <View
        style={chartStyles.chartBox}
        onLayout={event => {
          const width = Math.round(event.nativeEvent.layout.width);
          if (width > 0 && width !== chartWidth) {
            setChartWidth(width);
          }
        }}
      >
        <Svg width={chartWidth} height={CHART_HEIGHT}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={section.color} stopOpacity="0.28" />
              <Stop
                offset="100%"
                stopColor={section.color}
                stopOpacity="0.02"
              />
            </LinearGradient>
          </Defs>

          {areaPath ? <Path d={areaPath} fill={`url(#${gradientId})`} /> : null}

          {selectedPoint ? (
            <Line
              x1={selectedPoint.x}
              y1={CHART_PAD_TOP}
              x2={selectedPoint.x}
              y2={CHART_HEIGHT - CHART_PAD_BOTTOM}
              stroke={section.color}
              strokeWidth={1.2}
              strokeDasharray="3,3"
              opacity={0.6}
            />
          ) : null}

          {polylinePoints ? (
            <Polyline
              points={polylinePoints}
              fill="none"
              stroke={section.color}
              strokeWidth={2.2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null}

          {points.map(point => {
            const isSelected = point.dateKey === selectedDateKey;
            return (
              <Circle
                key={point.dateKey}
                cx={point.x}
                cy={point.y}
                r={isSelected ? 5.5 : 3.8}
                fill={isSelected ? colors.surface : section.color}
                stroke={section.color}
                strokeWidth={isSelected ? 2.5 : 0}
              />
            );
          })}
        </Svg>

        {/* Tap targets for each day */}
        <View style={chartStyles.touchOverlay}>
          {points.map(point => (
            <Pressable
              key={point.dateKey}
              style={chartStyles.touchColumn}
              onPress={() =>
                onSelectDate(
                  selectedDateKey === point.dateKey ? null : point.dateKey,
                )
              }
              accessibilityRole="button"
              accessibilityLabel={`${section.title} ${
                point.dayLabel
              }: ${section.formatValue(point.value)}`}
            />
          ))}
        </View>
      </View>

      {/* Day Labels Row */}
      <View style={chartStyles.labelsRow}>
        {currentWeek.map((item, idx) => {
          const isSelected = item.dateKey === selectedDateKey;
          const isToday = idx === currentWeek.length - 1;
          return (
            <Pressable
              key={item.dateKey}
              style={chartStyles.labelCell}
              onPress={() => onSelectDate(isSelected ? null : item.dateKey)}
            >
              <AppText
                variant="caption"
                bold={isSelected || isToday}
                style={{
                  fontSize: 11,
                  color: isSelected
                    ? section.color
                    : isToday
                    ? colors.textPrimary
                    : colors.textSecondary,
                }}
              >
                {item.dayLabel}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export const WeeklyWorkoutTrendChart: React.FC<
  WeeklyWorkoutTrendChartProps
> = ({ groupedActivities, selectedDateKey, onSelectDate }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const { currentDates, previousDates } = useMemo(() => {
    const all14 = recentIstDates(14);
    return {
      previousDates: all14.slice(0, 7),
      currentDates: all14.slice(7, 14),
    };
  }, []);

  const sectionData = useMemo(
    () =>
      SECTIONS.map(section => {
        const currentWeek: DayMetricPoint[] = currentDates.map(dateKey => ({
          dateKey,
          dayLabel: getShortWeekday(dateKey),
          value: extractDailyMetric(groupedActivities, dateKey, section.key),
        }));
        const previousTotal = previousDates.reduce(
          (sum, dateKey) =>
            sum + extractDailyMetric(groupedActivities, dateKey, section.key),
          0,
        );
        return { section, currentWeek, previousTotal };
      }),
    [currentDates, groupedActivities, previousDates],
  );

  return (
    <View style={chartStyles.wrapper}>
      {selectedDateKey ? (
        <View style={chartStyles.filterBar}>
          <AppText variant="caption" secondary>
            Selected day: {getShortWeekday(selectedDateKey)} ({selectedDateKey})
          </AppText>
          <Pressable
            onPress={() => onSelectDate(null)}
            style={[
              chartStyles.clearBtn,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <AppText variant="caption" bold color="primary">
              Clear
            </AppText>
          </Pressable>
        </View>
      ) : null}

      {sectionData.map(({ section, currentWeek, previousTotal }) => (
        <SectionAreaCard
          key={section.key}
          section={section}
          currentWeek={currentWeek}
          previousTotal={previousTotal}
          selectedDateKey={selectedDateKey}
          onSelectDate={onSelectDate}
        />
      ))}
    </View>
  );
};

const chartStyles = StyleSheet.create({
  wrapper: {
    gap: 12,
    marginBottom: 16,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  card: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleWrap: {
    gap: 2,
  },
  deltaWrap: {
    paddingTop: 2,
  },
  chartBox: {
    height: CHART_HEIGHT,
    width: '100%',
    position: 'relative',
  },
  touchOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
  },
  touchColumn: {
    flex: 1,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 2,
  },
  labelCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
});
