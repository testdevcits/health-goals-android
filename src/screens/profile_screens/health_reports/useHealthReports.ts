import { useEffect, useState } from 'react';
import { Alert, NativeModules } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { istDateKey } from '../../../utils/healthDates';
import { readStepsHistory } from '../../../services/healthConnect';

const METRICS = {
  Steps: 'steps',
  Sleep: 'sleep',
  Workouts: 'workout',
} as const;

export type HealthReportTab = keyof typeof METRICS;
export type DailyValue = {
  date: string;
  value: number;
  count: number;
  unit: string;
};

type ActivityDay = {
  day: string;
  totals?: {
    steps?: number;
    workoutMinutes?: number;
    sleepMinutes?: number;
  };
  creditedCoins?: number;
};

export default function useHealthReports() {
  const [activeTab, setActiveTab] = useState<HealthReportTab>('Steps');
  const [history, setHistory] = useState<DailyValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [dailyCoins, setDailyCoins] = useState<ActivityDay[]>([]);
  const [weekStepTotal, setWeekStepTotal] = useState(0);
  const to = new Date();
  const from = new Date(Date.now() - 6 * 86400000);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    let active = true;
    setLoading(true);
    setError('');
    const requestTo = new Date();
    const requestFrom = new Date(requestTo.getTime() - 6 * 86400000);
    const dateKey = istDateKey;
    const metricType =
      activeTab === 'Workouts' ? 'workout' : METRICS[activeTab];
    Promise.all([
      activeTab === 'Steps'
        ? readStepsHistory(7)
        : authenticatedRequest<{ history: DailyValue[] }>(
            'GET',
            `/health/history?metricType=${metricType}&from=${dateKey(
              requestFrom,
            )}&to=${dateKey(requestTo)}`,
          ).then(result => result.history),
      authenticatedRequest<{ items: ActivityDay[] }>(
        'GET',
        `/activity/history?from=${dateKey(requestFrom)}&to=${dateKey(
          requestTo,
        )}&limit=7`,
      ),
      readStepsHistory(7),
    ])
      .then(([reportHistory, coins, stepHistory]) => {
        if (!active) return;
        setHistory(reportHistory || []);
        setDailyCoins(coins.items || []);
        setWeekStepTotal(
          stepHistory.reduce((sum, item) => sum + item.value, 0),
        );
      })
      .catch(cause => {
        if (active) setError(apiErrorMessage(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeTab, isFocused, reloadKey]);

  const shareReport = (title: string) => {
    const total = history.reduce((sum, item) => sum + item.value, 0);
    const content = [
      `Report period: ${from.toLocaleDateString()} – ${to.toLocaleDateString()}`,
      `Selected metric: ${activeTab}`,
      `Synced total: ${total.toLocaleString()} ${history[0]?.unit || ''}`,
      `Daily average: ${
        history.length ? Math.round(total / history.length).toLocaleString() : 0
      }`,
      `Coins credited: ${dailyCoins.reduce(
        (sum, item) => sum + (item.creditedCoins || 0),
        0,
      )}`,
      `Days with activity: ${dailyCoins.length}`,
      `Data points: ${history.length}`,
    ].join('\n');
    const sharePdf = NativeModules.HealthAppConfig?.sharePdf;
    if (typeof sharePdf !== 'function') {
      Alert.alert(
        'Report export unavailable',
        'Update the Android app build to enable PDF sharing.',
      );
      return;
    }
    sharePdf(title, content);
  };

  const totalCoins = dailyCoins.reduce(
    (sum, item) => sum + (item.creditedCoins || 0),
    0,
  );

  return {
    activeTab,
    setActiveTab,
    history,
    loading,
    error,
    refresh: () => setReloadKey(value => value + 1),
    dailyCoins,
    weekStepTotal,
    from,
    to,
    shareReport,
    totalCoins,
  };
}
