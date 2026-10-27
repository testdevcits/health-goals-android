import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  readTodayHealthData,
  type TodayHealthData,
} from '../services/healthConnect';

type HealthDataState = {
  loading: boolean;
  data: TodayHealthData | null;
  error: string | null;
};

export const useTodayHealthData = (includeHourlyData = false) => {
  const [state, setState] = useState<HealthDataState>({
    loading: true,
    data: null,
    error: null,
  });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setState(previous => ({ ...previous, loading: true, error: null }));

      readTodayHealthData(includeHourlyData)
        .then(data => {
          if (isActive) {
            setState({ loading: false, data, error: null });
          }
        })
        .catch(error => {
          if (isActive) {
            setState({
              loading: false,
              data: null,
              error:
                error instanceof Error
                  ? error.message
                  : 'Could not read health data from Health Connect.',
            });
          }
        });

      return () => {
        isActive = false;
      };
    }, [includeHourlyData]),
  );

  return state;
};
