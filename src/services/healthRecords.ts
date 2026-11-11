import { authenticatedRequest } from './authenticatedApi';

export type HealthRecord = {
  id: string;
  metricType: string;
  value: number;
  unit: string;
  recordedAt: string;
  source: string;
  activityType?: string;
  [key: string]: unknown;
};

export type HealthRecordPage = {
  records: HealthRecord[];
  page: number;
  limit: number;
  hasMore: boolean;
  nextPage: number | null;
};

export async function fetchHealthRecords(
  metricType: string,
  from: string,
  to: string,
  page = 1,
  limit = 20,
): Promise<HealthRecordPage> {
  const query = new URLSearchParams({
    metricType,
    from,
    to,
    page: String(page),
    limit: String(limit),
  });
  const result = await authenticatedRequest<HealthRecordPage>(
    'GET',
    `/health/records?${query.toString()}`,
  );
  if (
    !Array.isArray(result?.records) ||
    !Number.isSafeInteger(result.page) ||
    !Number.isSafeInteger(result.limit) ||
    typeof result.hasMore !== 'boolean' ||
    result.records.some(
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
    throw new Error('The server returned an invalid health records page.');
  }
  return result;
}

export async function fetchHealthDashboard(): Promise<unknown> {
  return authenticatedRequest('GET', '/health/dashboard');
}

export async function createHealthRecord(
  record: Record<string, unknown>,
): Promise<unknown> {
  return authenticatedRequest('POST', '/health/records', record);
}
