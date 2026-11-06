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
import { authenticatedRequest } from '../../../../services/authenticatedApi';
import {
  istDateKey,
  recentIstDates,
  recentHealthDayLabels,
} from '../../../../utils/healthDates';
import { readStepsHistory } from '../../../../services/healthConnect';

const BAR_MAX_HEIGHT = 100;

const BarChart: React.FC<{ data: number[]; color: string }> = ({
  data,
  color,
}) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const maxValue = Math.max(...data, 1);

  return (
    <View style={styles.chartArea}>
      {data.map((value, index) => {
        const height =
          value > 0 ? Math.max(2, (value / maxValue) * BAR_MAX_HEIGHT) : 0;
        return (
          <View key={recentHealthDayLabels()[index]} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height,
                  backgroundColor: color,
                },
                index !== 4 && styles.barMuted,
              ]}
            />
            <AppText variant="caption" secondary>
              {recentHealthDayLabels()[index]}
            </AppText>
          </View>
        );
      })}
    </View>
  );
};

const ActivityTrends: React.FC<{ onPressDetails: () => void }> = ({
  onPressDetails,
}) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const [activeTab, setActiveTab] = useState<TrendTab>('Steps');
  const [trendData, setTrendData] = useState(TREND_DATA);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (!isFocused) return;
    let active = true;
    setLoading(true);
    setLoadError('');
    setHasData(false);
    const load = async () => {
      const end = new Date();
      const start = new Date(Date.now() - 6 * 86400000);
      const key = istDateKey;
      const metricType =
        activeTab === 'Steps'
          ? 'steps'
          : activeTab === 'Sleep'
          ? 'sleep'
          : 'active_minutes';
      const history =
        activeTab === 'Steps'
          ? await readStepsHistory(7)
          : (
              await authenticatedRequest<{
                history: Array<{ date: string; value: number }>;
              }>(
                'GET',
                `/health/history?metricType=${metricType}&from=${key(
                  start,
                )}&to=${key(end)}`,
              )
            ).history;
      if (!active) return;
      if (!history.length) {
        setLoading(false);
        return;
      }
      const byDate = new Map(history.map(row => [row.date, row.value]));
      const values = recentIstDates().map(date => byDate.get(date) || 0);
      const sum = values.reduce((total, value) => total + value, 0);
      const average = Math.round(sum / values.length);
      setTrendData(current => ({
        ...current,
        [activeTab]: {
          ...current[activeTab],
          bars: values,
          stats: current[activeTab].stats.map((stat, index) =>
            index === 0
              ? {
                  ...stat,
                  value:
                    activeTab === 'Sleep'
                      ? `${Math.floor(average / 60)}h ${Math.round(
                          average % 60,
                        )}m`
                      : sum.toLocaleString(),
                }
              : index === 1
              ? {
                  ...stat,
                  value:
                    activeTab === 'Sleep'
                      ? `${(average / 60).toFixed(1)}h`
                      : average.toLocaleString(),
                }
              : index === 2 && activeTab === 'Steps'
              ? {
                  ...stat,
                  value: values
                    .filter(value => value >= 10000)
                    .length.toString(),
                }
              : { ...stat, value: '—' },
          ),
        },
      }));
      setHasData(true);
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
  }, [activeTab, isFocused, reloadKey]);
  const activeTrendData = trendData[activeTab];

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
            <BarChart
              data={activeTrendData.bars}
              color={activeTrendData.color}
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

export default ActivityTrends;
