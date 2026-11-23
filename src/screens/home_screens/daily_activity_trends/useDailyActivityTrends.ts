import { Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../constants';
import { getCurrentUser } from '../../../services/profile';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { recentIstDates } from '../../../utils/healthDates';
import {
  readSleepHistory,
  readStepsHistory,
} from '../../../services/healthConnect';
import { fetchHealthTrend } from '../../../services/healthTrends';
import { storageService } from '../../../storage/storageService';
import { trendData as initialTrendData } from './trendData';
import type { TrendMetric } from './trendData';

const CACHE_KEY_DAILY_TRENDS = 'cache_daily_activity_trends_v2';
const CACHE_KEY_HOME_TRENDS = 'cache_trend_data';

const metricTypes = {
  Steps: 'steps',
  Sleep: 'sleep',
  Heart: 'heart_rate',
  Stress: 'stress',
} as const;

export default function useDailyActivityTrends() {
  const [activeMetric, setActiveMetric] = useState<TrendMetric>('Steps');
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalValues, setGoalValues] = useState<Record<TrendMetric, string>>({
    Steps: '10,000',
    Sleep: '8',
    Heart: '60',
    Stress: '3',
  });
  const goalValuesRef = useRef(goalValues);
  goalValuesRef.current = goalValues;
  const [goalDraft, setGoalDraft] = useState(goalValues.Steps);
  const [trendData, setTrendData] = useState(() => {
    // Purge legacy corrupted percentage cache
    storageService.remove('cache_daily_activity_trends');

    const v2Cached = storageService.getObject<typeof initialTrendData>(
      CACHE_KEY_DAILY_TRENDS,
    );
    const hasCorruptSteps =
      v2Cached?.Steps?.bars?.some(v => v !== null && v > 0 && v <= 100) &&
      !v2Cached?.Steps?.bars?.some(v => v !== null && v > 100);

    if (v2Cached && !hasCorruptSteps) {
      return v2Cached;
    }

    // Seed from Home Screen's fresh cache (cache_trend_data)
    const homeCached = storageService.getObject<{
      Steps?: {
        bars: (number | null)[];
        stats?: { value: string; label: string }[];
      };
      Sleep?: {
        bars: (number | null)[];
        stats?: { value: string; label: string }[];
      };
    }>(CACHE_KEY_HOME_TRENDS);

    if (homeCached) {
      const seeded = { ...initialTrendData };
      if (homeCached.Steps?.bars?.some(v => v !== null && v > 0)) {
        const homeBars = homeCached.Steps.bars;
        const validValues = homeBars.filter((v): v is number => v !== null);
        const sum = validValues.reduce((a, b) => a + b, 0);
        const avg = validValues.length
          ? Math.round(sum / validValues.length)
          : 0;
        seeded.Steps = {
          ...seeded.Steps,
          bars: homeBars,
          stats: [
            { value: sum.toLocaleString(), label: 'Last 7 days' },
            { value: avg.toLocaleString(), label: 'Daily avg' },
            {
              value: String(validValues.filter(v => v >= 10000).length),
              label: 'Days ≥10K',
            },
            { value: '—', label: 'Goal met' },
          ],
          insight: `${validValues.filter(v => v > 0).length
            } synced steps records in the last 7 days. Your average is ${avg.toLocaleString()} steps.`,
        };
      }
      if (homeCached.Sleep?.bars?.some(v => v !== null && v > 0)) {
        seeded.Sleep = {
          ...seeded.Sleep,
          bars: homeCached.Sleep.bars,
        };
      }
      return seeded;
    }

    return initialTrendData;
  });
  const cachedHasData = trendData[activeMetric]?.bars?.some(
    v => v !== null && v > 0,
  );
  const [loading, setLoading] = useState(!cachedHasData);
  const [hasData, setHasData] = useState(Boolean(cachedHasData));
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const data = trendData[activeMetric];
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    let active = true;
    const currentCached = storageService.getObject<typeof initialTrendData>(
      CACHE_KEY_DAILY_TRENDS,
    );
    const hasCurrentData = currentCached?.[activeMetric]?.bars?.some(
      v => v !== null && v > 0,
    );
    if (!hasCurrentData) {
      setLoading(true);
    }
    setLoadError('');

    (async () => {
      try {
        const dates = recentIstDates();
        let history: { date: string; value: number | null }[] = [];

        if (activeMetric === 'Steps') {
          try {
            const hcSteps = await readStepsHistory(7);
            if (hcSteps.length && hcSteps.some(item => item?.value > 0)) {
              history = hcSteps.map(item => ({
                date: item?.date,
                value: item?.value,
              }));
            } else {
              const res = await fetchHealthTrend(
                'steps',
                dates[0],
                dates[dates.length - 1],
              );
              history = res.series;
            }
          } catch {
            const fallback = await readStepsHistory(7).catch(() => []);
            history = fallback.map(item => ({
              date: item?.date,
              value: item?.value,
            }));
          }
        } else if (activeMetric === 'Sleep') {
          try {
            const hcSleep = await readSleepHistory(7);
            if (hcSleep.length && hcSleep.some(item => item?.value > 0)) {
              history = hcSleep.map(item => ({
                date: item?.date,
                value: item?.value,
              }));
            } else {
              const res = await fetchHealthTrend(
                'sleep',
                dates[0],
                dates[dates.length - 1],
              );
              history = res.series;
            }
          } catch {
            const fallback = await readSleepHistory(7).catch(() => []);
            history = fallback.map(item => ({
              date: item?.date,
              value: item?.value,
            }));
          }
        } else if (activeMetric === 'Heart') {
          const res = await fetchHealthTrend(
            'heart_rate',
            dates[0],
            dates[dates.length - 1],
          );
          history = res.series;
        } else {
          throw new Error(
            'Stress readings are not available from the connected health sources.',
          );
        }

        if (!active) return;

        // Fetch user health goal in background
        getCurrentUser()
          .then(user => {
            const saved = user.healthGoals?.[metricTypes[activeMetric]];
            if (saved && active) {
              setGoalValues(current => ({
                ...current,
                [activeMetric]: String(
                  activeMetric === 'Sleep' ? saved / 60 : saved,
                ),
              }));
            }
          })
          .catch(() => { });

        const byDate = new Map(history.map(row => [row.date, row.value]));
        const barsByDate = dates.map(date =>
          byDate.has(date) ? byDate.get(date) ?? null : null,
        );
        const values = barsByDate.filter(
          (value): value is number => value !== null,
        );
        const hasAnyNonZero = values.some(value => value > 0);
        if (!values.length || !hasAnyNonZero) {
          const homeCached = storageService.getObject<{
            Steps?: { bars: (number | null)[] };
          }>(CACHE_KEY_HOME_TRENDS);
          if (
            activeMetric === 'Steps' &&
            homeCached?.Steps?.bars?.some(v => v !== null && v > 0)
          ) {
            setHasData(true);
            return;
          }
          setHasData(false);
          return;
        }

        const average = Math.round(
          values.reduce((sum, value) => sum + value, 0) / values.length,
        );
        const total = values.reduce((sum, value) => sum + value, 0);
        const positiveValues = values.filter(value => value > 0);
        const lowestObserved = positiveValues.length
          ? Math.min(...positiveValues)
          : 0;

        const goal =
          Number(goalValuesRef.current[activeMetric].replace(/,/g, '')) *
          (activeMetric === 'Sleep' ? 60 : 1);
        const bars = barsByDate;
        const averageLabel =
          activeMetric === 'Sleep'
            ? `${Math.floor(average / 60)}h ${Math.round(average % 60)}m`
            : `${average.toLocaleString()}${activeMetric === 'Heart'
              ? ' bpm'
              : activeMetric === 'Steps'
                ? ' steps'
                : ''
            }`;
        setTrendData(current => {
          const updated = {
            ...current,
            [activeMetric]: {
              ...current[activeMetric],
              bars,
              stats:
                activeMetric === 'Steps'
                  ? [
                    { value: total.toLocaleString(), label: 'Last 7 days' },
                    { value: average.toLocaleString(), label: 'Daily avg' },
                    {
                      value: String(
                        values.filter(value => value >= 10000).length,
                      ),
                      label: 'Days ≥10K',
                    },
                    {
                      value: goal
                        ? `${Math.round(
                          (values.filter(value => value >= goal).length /
                            7) *
                          100,
                        )}%`
                        : '—',
                      label: 'Goal met',
                    },
                  ]
                  : activeMetric === 'Sleep'
                    ? [
                      { value: averageLabel, label: 'Daily avg' },
                      {
                        value: `${(Math.max(...values) / 60).toFixed(1)}h`,
                        label: 'Longest day',
                      },
                      {
                        value: `${(lowestObserved / 60).toFixed(1)}h`,
                        label: 'Shortest day',
                      },
                      {
                        value: String(positiveValues.length),
                        label: 'Days synced',
                      },
                    ]
                    : [
                      { value: averageLabel, label: 'Daily avg' },
                      {
                        value: String(Math.max(...values)),
                        label: 'Highest daily avg',
                      },
                      {
                        value: String(lowestObserved),
                        label: 'Lowest daily avg',
                      },
                      {
                        value: String(positiveValues.length),
                        label: 'Days synced',
                      },
                    ],
              insight: `${positiveValues.length
                } synced ${activeMetric.toLowerCase()} daily records in the last 7 days. Your average is ${averageLabel}.`,
            },
          };
          storageService.setObject(CACHE_KEY_DAILY_TRENDS, updated);
          return updated;
        });
        setHasData(true);
      } catch (error) {
        if (active) setLoadError(apiErrorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    })().catch(error => {
      if (active) {
        setLoadError(apiErrorMessage(error));
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [activeMetric, isFocused, reloadKey]);

  const openGoalEditor = () => {
    setGoalDraft(goalValues[activeMetric]);
    setGoalModalVisible(true);
  };

  const saveGoal = () => {
    const normalizedGoal = goalDraft.trim();
    if (!normalizedGoal || !/\d/.test(normalizedGoal)) {
      Alert.alert('Invalid goal', 'Enter a goal that includes a number.');
      return;
    }
    const numericGoal = Number(normalizedGoal.replace(/,/g, ''));
    if (!Number.isFinite(numericGoal) || numericGoal <= 0) {
      Alert.alert('Invalid goal', 'Enter a number greater than zero.');
      return;
    }
    const storedTarget =
      activeMetric === 'Sleep' ? Math.round(numericGoal * 60) : numericGoal;
    authenticatedRequest<{ user: { healthGoals?: Record<string, number> } }>(
      'PATCH',
      API_ENDPOINTS.AUTH.GOALS,
      { metricType: metricTypes[activeMetric], targetValue: storedTarget },
    )
      .then(() => {
        setGoalValues(current => ({
          ...current,
          [activeMetric]: normalizedGoal,
        }));
        setGoalModalVisible(false);
        showAppToast(
          'success',
          'Goal updated',
          'Your daily target has been saved.',
        );
      })
      .catch(error =>
        showAppToast('error', 'Could not save goal', apiErrorMessage(error)),
      );
  };

  return {
    activeMetric,
    setActiveMetric,
    goalModalVisible,
    setGoalModalVisible,
    goalDraft,
    setGoalDraft,
    data,
    loading,
    hasData,
    loadError,
    refresh: () => setReloadKey(value => value + 1),
    openGoalEditor,
    saveGoal,
  };
}
