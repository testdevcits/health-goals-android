import axios from 'axios';
import { NativeModules } from 'react-native';

// Android emulator reaches the host machine through 10.0.2.2. Replace this
// with the deployed HTTPS API origin for release builds.
const configuredBaseUrl = String(NativeModules.HealthAppConfig?.apiBaseUrl || '').trim().replace(/\/api\/v1\/?$/, '');
export const API_BASE_URL = (configuredBaseUrl || (__DEV__ ? 'http://10.0.2.2:5000' : 'https://release-api-not-configured.invalid')).replace(/\/$/, '') + '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error?.message || error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'Server response timed out. Please try again.'
        : 'Could not connect to the server. Check your connection and API URL.');
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export async function authenticatedRequest<T = any>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  timeout = 15000,
): Promise<T> {
  const { readSession, refreshSession } = await import('./auth');
  let session = await readSession();
  if (!session?.accessToken) throw new Error('Please sign in to continue.');

  const send = (accessToken: string) => api.request({
    method,
    url: path,
    data: body,
    timeout,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  try {
    const response = await send(session.accessToken);
    return response.data.data as T;
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
    session = await refreshSession();
    if (!session) throw error;
    const response = await send(session.accessToken);
    return response.data.data as T;
  }
}
