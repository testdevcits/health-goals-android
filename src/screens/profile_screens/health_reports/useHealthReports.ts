import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, NativeModules } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { localDateKey } from '../../../utils/healthDates';
import { readStepsHistory } from '../../../services/healthConnect';
import type { ActivityRecord } from '../../../services/activityRecords';
import { fetchHealthRecords } from '../../../services/healthRecords';
import {
  fetchHealthSummary,
  HealthSummary,
} from '../../../services/healthSummary';
import { showAppToast } from '../../../utils/appToast';

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

export type DailyActivityHistoryItem = {
  day: string;
  timezone?: string;
  state?: string;
  dueAt?: string;
  needsSettlement?: boolean;
  entitledCoins?: number;
  pendingCoins?: number;
  creditedCoins?: number;
  totals?: {
    steps?: number;
    workoutMinutes?: number;
    meditationMinutes?: number;
    sleepMinutes?: number;
    breakdown?: {
      steps?: number;
      workout?: number;
      meditation?: number;
      waterCheckin?: number;
      sleepCheckin?: number;
    };
  };
};

type ActivityHistoryResponse = {
  items: DailyActivityHistoryItem[];
  totalPages: number;
};

const fetchActivityHistory = async (
  from: Date,
  to: Date,
): Promise<DailyActivityHistoryItem[]> => {
  const dateKey = localDateKey;
  const range = `from=${dateKey(from)}&to=${dateKey(to)}&limit=100`;
  const firstPage = await authenticatedRequest<ActivityHistoryResponse>(
    'GET',
    `/activity/history?${range}&page=1`,
  );
  const pageCount = Number.isFinite(firstPage.totalPages)
    ? Math.max(1, Math.floor(firstPage.totalPages))
    : 1;
  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      authenticatedRequest<ActivityHistoryResponse>(
        'GET',
        `/activity/history?${range}&page=${index + 2}`,
      ),
    ),
  );
  return [firstPage, ...remainingPages].flatMap(page => page.items);
};

export default function useHealthReports() {
  const [activeTab, setActiveTab] = useState<HealthReportTab>('Steps');
  const [history, setHistory] = useState<DailyValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [dailyCoins, setDailyCoins] = useState<DailyActivityHistoryItem[]>([]);
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>([]);
  const [activityRecordsPage, setActivityRecordsPage] = useState(1);
  const [activityRecordsNextPage, setActivityRecordsNextPage] = useState<
    number | null
  >(null);
  const [activityRecordsHasMore, setActivityRecordsHasMore] = useState(false);
  const [activityRecordsLoading, setActivityRecordsLoading] = useState(false);
  const [activityRecordsLoadingMore, setActivityRecordsLoadingMore] =
    useState(false);
  const [activityRecordsError, setActivityRecordsError] = useState('');
  const [healthSummary, setHealthSummary] = useState<HealthSummary | null>(
    null,
  );
  const [healthSummaryLoading, setHealthSummaryLoading] = useState(false);
  const [healthSummaryError, setHealthSummaryError] = useState('');
  const activityRecordsLoadingMoreRef = useRef(false);
  const activityRecordsRequestVersionRef = useRef(0);
  const [weekStepTotal, setWeekStepTotal] = useState(0);
  const [from, setFrom] = useState(() => new Date(Date.now() - 6 * 86400000));
  const [to, setTo] = useState(() => new Date());
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    let active = true;
    setLoading(true);
    setError('');
    const dateKey = localDateKey;
    const metricType =
      activeTab === 'Workouts' ? 'workout' : METRICS[activeTab];
    Promise.all([
      activeTab === 'Steps'
        ? readStepsHistory(7, { from, to })
        : authenticatedRequest<{ history: DailyValue[] }>(
            'GET',
            `/health/history?metricType=${metricType}&from=${dateKey(
              from,
            )}&to=${dateKey(to)}`,
          ).then(result => result.history),
      fetchActivityHistory(from, to),
    ])
      .then(([reportHistory, activityHistory]) => {
        if (!active) return;
        setHistory(reportHistory || []);
        setDailyCoins(activityHistory);
        setWeekStepTotal(
          activityHistory.reduce(
            (sum, item) => sum + (item.totals?.steps ?? 0),
            0,
          ),
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
  }, [activeTab, from, isFocused, reloadKey, to]);

  useEffect(() => {
    if (!isFocused) return;
    let active = true;
    activityRecordsRequestVersionRef.current += 1;
    const metricType =
      activeTab === 'Workouts' ? 'workout' : METRICS[activeTab];
    const fromDate = localDateKey(from);
    const toDate = localDateKey(to);

    setActivityRecordsLoading(true);
    setActivityRecordsError('');
    fetchHealthRecords(metricType, fromDate, toDate, 1)
      .then(result => {
        if (!active) return;
        setActivityRecords(result.records);
        setActivityRecordsPage(result.page);
        setActivityRecordsHasMore(result.hasMore);
        setActivityRecordsNextPage(result.nextPage);
      })
      .catch(cause => {
        if (active) {
          setActivityRecords([]);
          setActivityRecordsHasMore(false);
          setActivityRecordsNextPage(null);
          setActivityRecordsError(apiErrorMessage(cause));
        }
      })
      .finally(() => {
        if (active) setActivityRecordsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activeTab, from, isFocused, reloadKey, to]);

  useEffect(() => {
    if (!isFocused) return;
    let active = true;
    setHealthSummaryLoading(true);
    setHealthSummaryError('');
    fetchHealthSummary()
      .then(result => {
        if (active) setHealthSummary(result);
      })
      .catch(cause => {
        if (active) {
          setHealthSummary(null);
          setHealthSummaryError(apiErrorMessage(cause));
        }
      })
      .finally(() => {
        if (active) setHealthSummaryLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isFocused, reloadKey]);

  const loadMoreActivityRecords = useCallback(async () => {
    if (activityRecordsLoadingMoreRef.current || !activityRecordsHasMore) {
      return;
    }
    activityRecordsLoadingMoreRef.current = true;
    setActivityRecordsLoadingMore(true);
    const requestVersion = activityRecordsRequestVersionRef.current;
    try {
      const metricType =
        activeTab === 'Workouts' ? 'workout' : METRICS[activeTab];
      const requestedPage = activityRecordsNextPage ?? activityRecordsPage + 1;
      const nextPage = await fetchHealthRecords(
        metricType,
        localDateKey(from),
        localDateKey(to),
        requestedPage,
      );
      if (requestVersion !== activityRecordsRequestVersionRef.current) return;
      setActivityRecords(current => {
        const existingIds = new Set(current.map(record => record.id));
        return [
          ...current,
          ...nextPage.records.filter(record => !existingIds.has(record.id)),
        ];
      });
      setActivityRecordsPage(nextPage.page);
      setActivityRecordsHasMore(nextPage.hasMore);
      setActivityRecordsNextPage(nextPage.nextPage);
    } catch (cause) {
      showAppToast(
        'error',
        'Could not load more records',
        apiErrorMessage(cause),
      );
    } finally {
      activityRecordsLoadingMoreRef.current = false;
      setActivityRecordsLoadingMore(false);
    }
  }, [
    activeTab,
    activityRecordsPage,
    activityRecordsHasMore,
    activityRecordsNextPage,
    from,
    to,
  ]);

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
    activityRecords,
    activityRecordsLoading,
    activityRecordsLoadingMore,
    activityRecordsError,
    hasMoreActivityRecords: activityRecordsHasMore,
    loadMoreActivityRecords,
    healthSummary,
    healthSummaryLoading,
    healthSummaryError,
    weekStepTotal,
    from,
    to,
    setFrom,
    setTo,
    shareReport,
    totalCoins,
  };
}
