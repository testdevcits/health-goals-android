import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  readTodayHealthData,
  type TodayHealthData,
} from '../services/healthConnect';
import { syncRecentHealthData } from '../services/healthSync';
import { apiErrorMessage } from '../services/api';
import { storageService } from '../storage/storageService';
import { istDateKey } from '../utils/healthDates';

const CACHE_KEY_TODAY_HEALTH = 'cache_today_health_data';

export type HealthDataState = {
  loading: boolean;
  data: TodayHealthData | null;
  error: string | null;
  syncError: string | null;
  syncVersion: number;
};

export const useTodayHealthData = (
  includeHourlyData = false,
  refreshKey = 0,
  enabled = true,
) => {
  const isFocused = useIsFocused();
  const [foregroundTick, setForegroundTick] = useState(0);
  const todayCacheKey = `${CACHE_KEY_TODAY_HEALTH}:${istDateKey(new Date())}`;

  useEffect(() => {
    if (!isFocused || !enabled) return;
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        setForegroundTick(prev => prev + 1);
      }
    });
    return () => subscription.remove();
  }, [isFocused, enabled]);
  const [state, setState] = useState<HealthDataState>(() => {
    const cached = storageService.getObject<TodayHealthData>(todayCacheKey);
    return {
      loading: !cached,
      data: cached || null,
      error: null,
      syncError: null,
      syncVersion: 0,
    };
  });

  useEffect(() => {
    if (!isFocused || !enabled) return;
    let isActive = true;
    setState(previous => ({
      ...previous,
      loading: !previous.data,
      error: null,
      syncError: null,
    }));

    // Server sync must not depend on every optional dashboard read succeeding.
    syncRecentHealthData()
      .then(result => {
        if (isActive)
          setState(previous => ({
            ...previous,
            syncVersion: previous.syncVersion + 1,
            syncError: result.failedMetrics?.length
              ? `Could not read ${result.failedMetrics.join(', ')}. Retry sync.`
              : null,
          }));
      })
      .catch(error => {
        if (isActive)
          setState(previous => ({
            ...previous,
            syncError: apiErrorMessage(error),
          }));
      });

    readTodayHealthData(includeHourlyData)
      .then(data => {
        if (isActive) {
          if (data) {
            storageService.setObject(todayCacheKey, data);
          }
          setState(previous => ({
            ...previous,
            loading: false,
            data,
            error: null,
          }));
        }
      })
      .catch(error => {
        if (isActive) {
          setState(previous => ({
            ...previous,
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Could not read health data from Health Connect.',
          }));
        }
      });

    return () => {
      isActive = false;
    };
  }, [
    isFocused,
    enabled,
    includeHourlyData,
    refreshKey,
    foregroundTick,
    todayCacheKey,
  ]);

  return state;
};
