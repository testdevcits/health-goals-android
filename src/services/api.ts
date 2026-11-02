import axios from 'axios';
import { NativeModules } from 'react-native';

const API_PATH = '/api/v1';
const DEFAULT_API_ORIGIN = __DEV__
  ? 'https://health-goals-backend.vercel.app'
  : 'https://release-api-not-configured.invalid';

const configuredApiOrigin = String(
  NativeModules.HealthAppConfig?.apiBaseUrl ?? '',
)
  .trim()
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/i, '');

export const API_BASE_URL = `${configuredApiOrigin || DEFAULT_API_ORIGIN}${API_PATH}`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

type ApiErrorResponse = {
  error?: { message?: unknown };
  message?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getApiErrorMessage(data: unknown): string | undefined {
  if (!isRecord(data)) {
    return undefined;
  }

  const nestedError = data.error;
  if (isRecord(nestedError) && typeof nestedError.message === 'string') {
    return nestedError.message;
  }

  return typeof data.message === 'string' ? data.message : undefined;
}

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseMessage = getApiErrorMessage(error.response?.data);
    if (responseMessage) {
      return responseMessage;
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'Server response timed out. Please try again.';
    }

    return 'Could not connect to the server. Check your connection and API URL.';
  }

  return error instanceof Error
    ? error.message
    : 'Something went wrong. Please try again.';
}
