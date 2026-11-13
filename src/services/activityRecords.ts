import { authenticatedRequest } from './authenticatedApi';
import { API_ENDPOINTS } from '../constants/endpoints';

export type ActivityRecord = {
  id: string;
  metricType: string;
  value: number;
  unit: string;
  recordedAt: string;
  source: string;
  activityType?: string;
};

export type ActivityRecordPage = {
  items: ActivityRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchActivityRecords(
  metricType: string,
  from: string,
  to: string,
  page: number,
  limit = 20,
): Promise<ActivityRecordPage> {
  const query = new URLSearchParams({
    metricType,
    from,
    to,
    page: String(page),
    limit: String(limit),
  }).toString();
  const result = await authenticatedRequest<ActivityRecordPage>(
    'GET',
    `${API_ENDPOINTS.ACTIVITY.RECORDS}?${query}`,
  );
  if (
    !Array.isArray(result?.items) ||
    !Number.isSafeInteger(result.total) ||
    result.total < 0 ||
    !Number.isSafeInteger(result.page) ||
    result.page < 1 ||
    !Number.isSafeInteger(result.limit) ||
    result.limit < 1 ||
    !Number.isSafeInteger(result.totalPages) ||
    result.totalPages < 0 ||
    result.items.some(
      record =>
        !record ||
        typeof record.id !== 'string' ||
        typeof record.metricType !== 'string' ||
        !Number.isFinite(record.value) ||
        typeof record.unit !== 'string' ||
        typeof record.recordedAt !== 'string' ||
        typeof record.source !== 'string',
    )
  ) {
    throw new Error('The server returned an invalid activity records page.');
  }
  return result;
}
