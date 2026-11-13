import { Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../constants';
import { getCurrentUser } from '../../../services/profile';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { recentIstDates } from '../../../utils/healthDates';
import { readStepsHistory } from '../../../services/healthConnect';
import { fetchHealthTrend } from '../../../services/healthTrends';
import { trendData as initialTrendData } from './trendData';
import type { TrendMetric } from './trendData';

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
  const [trendData, setTrendData] = useState(initialTrendData);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const data = trendData[activeMetric];
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    let active = true;
    setLoading(true);
    setLoadError('');
    setHasData(false);
    (async () => {
      try {
        const dates = recentIstDates();
        const [recordsResult, goalResult] = await Promise.allSettled([
          activeMetric === 'Steps'
            ? readStepsHistory(7).then(history =>
                history.map(item => ({ date: item.date, value: item.value })),
              )
            : activeMetric === 'Stress'
            ? Promise.reject(
                new Error(
                  'Stress readings are not available from the connected health sources.',
                ),
              )
            : fetchHealthTrend(
                metricTypes[activeMetric],
                dates[0],
                dates[dates.length - 1],
              ).then(result => result.series),
          getCurrentUser(),
        ]);
        if (!active) return;
        if (goalResult.status === 'fulfilled') {
          const saved =
            goalResult.value.healthGoals?.[metricTypes[activeMetric]];
          if (saved) {
            setGoalValues(current => ({
              ...current,
              [activeMetric]: String(
                activeMetric === 'Sleep' ? saved / 60 : saved,
              ),
            }));
          }
        }
        if (recordsResult.status === 'rejected') {
          setLoadError(apiErrorMessage(recordsResult.reason));
          return;
        }
        if (recordsResult.status === 'fulfilled') {
          const byDate = new Map(
            recordsResult.value.map(row => [row.date, row.value]),
          );
          const barsByDate = dates.map(date =>
            byDate.has(date) ? byDate.get(date) ?? null : null,
          );
          const values = barsByDate.filter(
            (value): value is number => value !== null,
          );
          if (!values.length) return;
          const average = Math.round(
            values.reduce((sum, value) => sum + value, 0) / values.length,
          );
          const total = values.reduce((sum, value) => sum + value, 0);
          const savedGoal =
            goalResult.status === 'fulfilled'
              ? goalResult.value.healthGoals?.[metricTypes[activeMetric]]
              : undefined;
          const goal =
            Number(
              savedGoal ||
                goalValuesRef.current[activeMetric].replace(/,/g, ''),
            ) * (activeMetric === 'Sleep' && !savedGoal ? 60 : 1);
          const bars = barsByDate.map(value =>
            value === null
              ? null
              : goal
              ? Math.max(0, Math.min(100, Math.round((value / goal) * 100)))
              : 0,
          );
          const averageLabel =
            activeMetric === 'Sleep'
              ? `${Math.floor(average / 60)}h ${Math.round(average % 60)}m`
              : `${average}${activeMetric === 'Heart' ? ' bpm' : ''}`;
          setTrendData(current => ({
            ...current,
            [activeMetric]: {
              ...current[activeMetric],
              bars,
              stats:
                activeMetric === 'Steps'
                  ? [
                      { value: total.toLocaleString(), label: 'Last 7 days' },
                      { value: String(average), label: 'Daily avg' },
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
                        value: `${(Math.min(...values) / 60).toFixed(1)}h`,
                        label: 'Shortest day',
                      },
                      { value: String(values.length), label: 'Days synced' },
                    ]
                  : [
                      { value: averageLabel, label: 'Daily avg' },
                      {
                        value: String(Math.max(...values)),
                        label: 'Highest daily avg',
                      },
                      {
                        value: String(Math.min(...values)),
                        label: 'Lowest daily avg',
                      },
                      { value: String(values.length), label: 'Days synced' },
                    ],
              insight: `${
                values.length
              } synced ${activeMetric.toLowerCase()} daily records in the last 7 days. Your average is ${averageLabel}.`,
            },
          }));
          setHasData(true);
        }
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
