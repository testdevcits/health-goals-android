import { authenticatedRequest } from './authenticatedApi';

export type HealthSummary = Record<string, number>;

export async function fetchHealthSummary(): Promise<HealthSummary> {
  const result = await authenticatedRequest<HealthSummary>(
    'GET',
    '/health/summary',
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
