import { authenticatedRequest } from './authenticatedApi';
import { API_ENDPOINTS } from '../constants/endpoints';

export type HealthSummary = Record<string, number>;

export async function fetchHealthSummary(): Promise<HealthSummary> {
  const result = await authenticatedRequest<HealthSummary>(
    'GET',
    API_ENDPOINTS.HEALTH.SUMMARY,
  );
  if (
    !result ||
    typeof result !== 'object' ||
    Array.isArray(result) ||
    Object.values(result).some(value => !Number.isFinite(value))
  ) {
    throw new Error('The server returned an invalid health summary.');
  }
  return result;
}
