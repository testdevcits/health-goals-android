import { authenticatedRequest } from './authenticatedApi';

export type HealthTrendMetric =
  | 'steps'
  | 'workout'
  | 'meditation'
  | 'water_checkin'
  | 'sleep_checkin'
  | 'running'
  | 'walking'
  | 'heart_rate'
  | 'sleep'
  | 'oxygen_saturation'
  | 'weight'
  | 'blood_pressure'
  | 'calories'
  | 'distance'
  | 'active_minutes';

export type HealthTrendPoint = {
  date: string;
  value: number | null;
  unit: string;
  count: number;
  component?: string;
};

type HealthTrendResponse = {
  metricType: HealthTrendMetric;
  from: string;
  to: string;
  timezone: string;
  series: HealthTrendPoint[];
};

export async function fetchHealthTrend(
  metricType: HealthTrendMetric,
  from: string,
  to: string,
): Promise<HealthTrendResponse> {
  const query = new URLSearchParams({ metricType, from, to }).toString();
  const result = await authenticatedRequest<HealthTrendResponse>(
    'GET',
    `/health/trends?${query}`,
  );
  if (
    !Array.isArray(result?.series) ||
    result.series.some(
      point =>
        !point ||
        typeof point.date !== 'string' ||
        (point.value !== null &&
          (typeof point.value !== 'number' || !Number.isFinite(point.value))) ||
        typeof point.unit !== 'string' ||
        !Number.isSafeInteger(point.count) ||
        point.count < 0,
    )
  ) {
    throw new Error('The server returned an invalid health trend.');
  }
  return result;
}
