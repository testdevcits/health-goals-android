import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  readTodayHealthData,
  type TodayHealthData,
} from '../services/healthConnect';
import { syncRecentHealthData } from '../services/healthSync';
import { apiErrorMessage } from '../services/api';
import { storageService } from '../storage/storageService';

const CACHE_KEY_TODAY_HEALTH = 'cache_today_health_data';

type HealthDataState = {
  loading: boolean;
  data: TodayHealthData | null;
  error: string | null;
  syncError: string | null;
  syncVersion: number;
};

export const useTodayHealthData = (
  includeHourlyData = false,
  refreshKey = 0,
) => {
  const isFocused = useIsFocused();
  const [state, setState] = useState<HealthDataState>(() => {
    const cached = storageService.getObject<TodayHealthData>(CACHE_KEY_TODAY_HEALTH);
    return {
      loading: !cached,
      data: cached || null,
      error: null,
      syncError: null,
      syncVersion: 0,
    };
  });

  useEffect(() => {
    if (!isFocused) return;
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
            storageService.setObject(CACHE_KEY_TODAY_HEALTH, data);
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
  }, [isFocused, includeHourlyData, refreshKey]);

  return state;
};
