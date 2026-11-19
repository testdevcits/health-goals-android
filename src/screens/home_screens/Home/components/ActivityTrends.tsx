import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  AppEmptyState,
  AppErrorView,
  AppLoader,
  AppText,
  SectionHeader,
} from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { TREND_DATA, TREND_TABS, TrendTab } from '../const';
import { createHomeStyles } from '../styles.Home';
import {
  recentIstDates,
  recentHealthDayLabels,
} from '../../../../utils/healthDates';
import {
  readActiveMinutesHistory,
  readSleepHistory,
  readStepsHistory,
} from '../../../../services/healthConnect';
import { fetchHealthTrend } from '../../../../services/healthTrends';
import { storageService } from '../../../../storage/storageService';

const CACHE_KEY_TREND_DATA = 'cache_trend_data';

const BAR_MAX_HEIGHT = 75;

const formatMetricValue = (value: number | null, tab: TrendTab): string => {
  if (value === null || value === 0) {
    if (tab === 'Steps') return '0 steps';
    if (tab === 'Sleep') return '0h 0m';
    return '0 mins';
  }
  if (tab === 'Steps') {
    return `${value.toLocaleString()} steps`;
  }
  if (tab === 'Sleep') {
    const hours = Math.floor(value / 60);
    const mins = Math.round(value % 60);
    return `${hours}h ${mins}m`;
  }
  return `${value.toLocaleString()} mins`;
};

const formatShortTooltipValue = (
  value: number | null,
  tab: TrendTab,
): string => {
  if (value === null || value === 0) return '0';
  if (tab === 'Steps') {
    if (value >= 1000) {
      const k = (value / 1000)
        .toFixed(value >= 10000 ? 0 : 1)
        .replace(/\.0$/, '');
      return `${k}k`;
    }
    return value.toLocaleString();
  }
  if (tab === 'Sleep') {
    const hours = Math.floor(value / 60);
    const mins = Math.round(value % 60);
    return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
  }
  return `${value}m`;
};

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

const BarChart: React.FC<{
  data: (number | null)[];
  color: string;
  activeTab: TrendTab;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}> = ({ data, color, activeTab, selectedIndex, onSelectIndex }) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const labels = recentHealthDayLabels();
  const maxValue = Math.max(
    ...data.filter((value): value is number => value !== null),
    1,
  );

  return (
    <View style={styles.chartArea}>
      {data.map((value, index) => {
        const height =
          value !== null && value > 0
            ? Math.max(4, (value / maxValue) * BAR_MAX_HEIGHT)
            : 4;
        const isSelected = selectedIndex === index;

        return (
          <TouchableOpacity
            key={labels[index]}
            activeOpacity={0.7}
            style={styles.barTouchableColumn}
            onPress={() => onSelectIndex(index)}
            accessibilityRole="button"
            accessibilityLabel={`${labels[index]}: ${formatMetricValue(
              value,
              activeTab,
            )}`}
          >
            {isSelected && (
              <View
                style={[
                  styles.barTooltip,
                  {
                    backgroundColor: theme.colors.surfaceElevated,
                    borderColor: color,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  bold
                  style={[styles.barTooltipText, { color }]}
                >
                  {formatShortTooltipValue(value, activeTab)}
                </AppText>
              </View>
            )}
            <View
              style={[
                styles.bar,
                {
                  height,
                  backgroundColor: color,
                },
                !isSelected && styles.barMuted,
                isSelected && [styles.barSelected, { shadowColor: color }],
              ]}
            />
            <AppText
              variant="caption"
              bold={isSelected}
              color={isSelected ? undefined : 'textSecondary'}
              style={isSelected ? { color } : undefined}
            >
              {labels[index]}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const ActivityTrends: React.FC<{
  onPressDetails: () => void;
  healthRefreshKey?: number;
}> = ({ onPressDetails, healthRefreshKey = 0 }) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const [activeTab, setActiveTab] = useState<TrendTab>('Steps');
  const [trendData, setTrendData] = useState(() => {
    return (
      storageService.getObject<typeof TREND_DATA>(CACHE_KEY_TREND_DATA) ||
      TREND_DATA
    );
  });
  const [selectedIndex, setSelectedIndex] = useState<number>(6);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const isFocused = useIsFocused();

  const activeTrendData = trendData[activeTab];
  const hasData = activeTrendData.bars.some(
    value => value !== null && value > 0,
  );

  React.useEffect(() => {
    if (!isFocused) return;
    let active = true;
    const currentCached =
      storageService.getObject<typeof TREND_DATA>(CACHE_KEY_TREND_DATA);
    const hasCachedData = currentCached?.[activeTab]?.bars.some(
      v => v !== null && v > 0,
    );
    if (!hasCachedData) {
      setLoading(true);
    }
    setLoadError('');

    const load = async () => {
      const dates = recentIstDates();
      let history: { date: string; value: number | null }[] = [];

      try {
        if (activeTab === 'Steps') {
          const hcSteps = await readStepsHistory(7);
          if (hcSteps.length && hcSteps.some(item => item.value > 0)) {
            history = hcSteps.map(item => ({
              date: item.date,
              value: item.value,
            }));
          } else {
            const res = await fetchHealthTrend(
              'steps',
              dates[0],
              dates[dates.length - 1],
            );
            history = res.series;
          }
        } else if (activeTab === 'Sleep') {
          const hcSleep = await readSleepHistory(7);
          if (hcSleep.length && hcSleep.some(item => item.value > 0)) {
            history = hcSleep.map(item => ({
              date: item.date,
              value: item.value,
            }));
          } else {
            const res = await fetchHealthTrend(
              'sleep',
              dates[0],
              dates[dates.length - 1],
            );
            history = res.series;
          }
        } else {
          const hcActive = await readActiveMinutesHistory(7);
          if (hcActive.length && hcActive.some(item => item.value > 0)) {
            history = hcActive.map(item => ({
              date: item.date,
              value: item.value,
            }));
          } else {
            const res = await fetchHealthTrend(
              'active_minutes',
              dates[0],
              dates[dates.length - 1],
            );
            history = res.series;
          }
        }
      } catch {
        if (activeTab === 'Steps') {
          const fallback = await readStepsHistory(7).catch(() => []);
          history = fallback.map(item => ({
            date: item.date,
            value: item.value,
          }));
        } else if (activeTab === 'Sleep') {
          const fallback = await readSleepHistory(7).catch(() => []);
          history = fallback.map(item => ({
            date: item.date,
            value: item.value,
          }));
        } else {
          const fallback = await readActiveMinutesHistory(7).catch(() => []);
          history = fallback.map(item => ({
            date: item.date,
            value: item.value,
          }));
        }
      }

      if (!active) return;
      const byDate = new Map(history.map(row => [row.date, row.value]));
      const values = dates.map(date =>
        byDate.has(date) ? byDate.get(date) ?? null : null,
      );
      const observedValues = values.filter(
        (value): value is number => value !== null,
      );
      const hasAnyNonZero = observedValues.some(value => value > 0);

      if (!observedValues.length || !hasAnyNonZero) {
        setTrendData(current => {
          const updated = {
            ...current,
            [activeTab]: {
              ...current[activeTab],
              bars: values,
            },
          };
          storageService.setObject(CACHE_KEY_TREND_DATA, updated);
          return updated;
        });
        setLoading(false);
        return;
      }

      const sum = observedValues.reduce((total, value) => total + value, 0);
      const average = Math.round(sum / observedValues.length);
      const positiveSleep = observedValues.filter(value => value > 0);
      const lowestSleep = positiveSleep.length ? Math.min(...positiveSleep) : 0;
      const qualityScore = Math.round(
        (observedValues.filter(value => value >= 420).length /
          observedValues.length) *
          100,
      );

      setTrendData(current => {
        const updated = {
          ...current,
          [activeTab]: {
            ...current[activeTab],
            bars: values,
            stats:
              activeTab === 'Steps'
                ? [
                    { value: sum.toLocaleString(), label: 'Total' },
                    { value: average.toLocaleString(), label: 'Daily Avg' },
                    {
                      value: String(
                        observedValues.filter(value => value >= 10000).length,
                      ),
                      label: 'Days >10K',
                    },
                  ]
                : activeTab === 'Sleep'
                ? [
                    {
                      value: `${Math.floor(average / 60)}h ${Math.round(
                        average % 60,
                      )}m`,
                      label: 'Avg Sleep',
                    },
                    { value: `${qualityScore}%`, label: 'Quality' },
                    {
                      value: `${(lowestSleep / 60).toFixed(1)}h`,
                      label: 'Lowest',
                    },
                  ]
                : [
                    { value: sum.toLocaleString(), label: 'Total Mins' },
                    { value: average.toLocaleString(), label: 'Daily Avg' },
                    {
                      value: String(
                        observedValues.filter(value => value === 0).length,
                      ),
                      label: 'Rest Days',
                    },
                  ],
          },
        };
        storageService.setObject(CACHE_KEY_TREND_DATA, updated);
        return updated;
      });
    };

    load()
      .catch(error => {
        if (active)
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Could not load activity trends.',
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activeTab, healthRefreshKey, isFocused, reloadKey]);

  return (
    <>
      <SectionHeader
        sectionTitle="Daily Activity Trends"
        rightText="Details"
        onRightPress={onPressDetails}
      />
      <View style={styles.trendsCard}>
        <View style={styles.tabRow}>
          {TREND_TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab }}
            >
              <AppText
                variant="label"
                bold={activeTab === tab}
                color={activeTab === tab ? 'textPrimary' : 'textSecondary'}
              >
                {tab}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
        {loading ? (
          <AppLoader message="Loading activity trends…" />
        ) : loadError ? (
          <AppErrorView
            message={loadError}
            onRefresh={() => setReloadKey(value => value + 1)}
          />
        ) : !hasData ? (
          <AppEmptyState
            title={`No ${activeTab.toLowerCase()} data yet`}
            description="Health data from the last 7 days will appear here after it syncs."
          />
        ) : (
          <>
            <View style={styles.selectedReadoutRow}>
              <View style={styles.selectedReadoutLeft}>
                <View
                  style={[
                    styles.selectedIndicatorDot,
                    { backgroundColor: activeTrendData.color },
                  ]}
                />
                <AppText variant="caption" color="textSecondary">
                  {getDayFullLabel(selectedIndex)}
                </AppText>
              </View>
              <View
                style={[
                  styles.selectedPill,
                  {
                    backgroundColor: `${activeTrendData.color}1F`,
                    borderColor: activeTrendData.color,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  bold
                  style={{ color: activeTrendData.color }}
                >
                  {formatMetricValue(
                    activeTrendData.bars[selectedIndex] ?? null,
                    activeTab,
                  )}
                </AppText>
              </View>
            </View>
            <BarChart
              data={activeTrendData.bars}
              color={activeTrendData.color}
              activeTab={activeTab}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
            />
            <View style={styles.statsRow}>
              {activeTrendData.stats.map((stat, index) => (
                <React.Fragment key={stat.label}>
                  {index > 0 && <View style={styles.statDivider} />}
                  <View style={styles.statItem}>
                    <AppText variant="subtitle1" bold mb={2}>
                      {stat.value}
                    </AppText>
                    <AppText variant="caption" secondary>
                      {stat.label}
                    </AppText>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default React.memo(ActivityTrends);
