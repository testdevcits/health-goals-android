import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  readTodayHealthData,
  type TodayHealthData,
} from '../services/healthConnect';
import { syncRecentHealthData } from '../services/healthSync';

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
  const [state, setState] = useState<HealthDataState>({
    loading: true,
    data: null,
    error: null,
    syncError: null,
    syncVersion: 0,
  });

  useEffect(() => {
    if (!isFocused) return;
    let isActive = true;
    setState(previous => ({ ...previous, loading: true, error: null, syncError: null }));

    // Server sync must not depend on every optional dashboard read succeeding.
    void syncRecentHealthData()
      .then(result => {
        if (isActive) setState(previous => ({
          ...previous,
          syncVersion: previous.syncVersion + 1,
          syncError: result.failedMetrics?.length
            ? `Could not read ${result.failedMetrics.join(', ')}. Retry sync.` : null,
        }));
      })
      .catch(error => {
        if (isActive) setState(previous => ({
          ...previous,
          syncError: error instanceof Error ? error.message : 'Could not send health data to the server.',
        }));
      });

    readTodayHealthData(includeHourlyData)
      .then(data => {
        if (isActive) {
          setState(previous => ({ ...previous, loading: false, data, error: null }));
        }
      })
      .catch(error => {
        if (isActive) {
          setState(previous => ({
            ...previous,
            loading: false,
            data: null,
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
