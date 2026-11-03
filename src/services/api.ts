
import axios, {
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { NativeModules } from 'react-native';

// ============================================
// API CONFIGURATION
// ============================================

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

// ============================================
// AXIOS INSTANCE
// ============================================

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// ============================================
// SENSITIVE DATA SANITIZATION
// ============================================

const SENSITIVE_FIELD =
  /password|passcode|otp|token|secret|authorization|cookie|api.?key|credential|email|phone/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizeValue(
  value: unknown,
  seen = new WeakSet<object>(),
): unknown {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return sanitizeValue(parsed, seen);
    } catch {
      return '[STRING OMITTED]';
    }
  }

  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (seen.has(value)) {
    return '[Circular]';
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item, seen));
  }

  if (!isRecord(value)) {
    return '[OBJECT OMITTED]';
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      SENSITIVE_FIELD.test(key)
        ? '[REDACTED]'
        : sanitizeValue(item, seen),
    ]),
  );
}

// ============================================
// URL SANITIZATION
// ============================================

function sanitizeUrl(url: string): string {
  const [urlWithoutHash, hash = ''] = url.split('#');
  const queryIndex = urlWithoutHash.indexOf('?');

  if (queryIndex === -1) {
    return url;
  }

  const path = urlWithoutHash.slice(0, queryIndex);

  const query = urlWithoutHash
    .slice(queryIndex + 1)
    .split('&')
    .map(parameter => {
      const equalsIndex = parameter.indexOf('=');

      const key =
        equalsIndex >= 0
          ? parameter.slice(0, equalsIndex)
          : parameter;

      let decodedKey = key;

      try {
        decodedKey = decodeURIComponent(
          key.replace(/\+/g, ' '),
        );
      } catch {
        // Keep malformed query keys unchanged.
      }

      return SENSITIVE_FIELD.test(decodedKey)
        ? `${key}=[REDACTED]`
        : parameter;
    })
    .join('&');

  return `${path}?${query}${hash ? `#${hash}` : ''}`;
}

// ============================================
// REQUEST DETAILS
// ============================================

function getRequestDetails(config: AxiosRequestConfig = {}) {
  return {
    method: config.method?.toUpperCase() ?? 'UNKNOWN',
    url: sanitizeUrl(axios.getUri(config)),
    headers: sanitizeValue(
      Object.fromEntries(
        Object.entries(config.headers ?? {}),
      ),
    ),
    payload: sanitizeValue(config.data),
  };
}

// ============================================
// DEVELOPMENT LOGGING
// ============================================

if (__DEV__) {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      console.info('[API] Request', getRequestDetails(config));
      return config;
    },
    error => {
      console.error('[API] Request interceptor error', {
        message: error?.message,
      });

      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    response => {
      console.info('[API] Response', {
        ...getRequestDetails(response.config),
        status: response.status,
        payload: sanitizeValue(response.data),
      });

      return response;
    },
    error => {
      if (axios.isAxiosError(error)) {
        console.error('[API] Request failed', {
          ...getRequestDetails(error.config),
          status: error.response?.status,
          code: error.code,
          response: sanitizeValue(error.response?.data),
          message: error.message,
        });
      } else {
        console.error('[API] Request failed', {
          code: 'UNKNOWN_ERROR',
          message: error?.message,
        });
      }

      return Promise.reject(error);
    },
  );
}

// ============================================
// API ERROR HANDLING
// ============================================

type ApiErrorResponse = {
  error?: {
    message?: unknown;
  };
  message?: unknown;
};

function getApiErrorMessage(data: unknown): string | undefined {
  if (!isRecord(data)) {
    return undefined;
  }

  const nestedError = data.error;

  if (
    isRecord(nestedError) &&
    typeof nestedError.message === 'string'
  ) {
    return nestedError.message;
  }

  return typeof data.message === 'string'
    ? data.message
    : undefined;
}

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseMessage = getApiErrorMessage(
      error.response?.data,
    );

    if (responseMessage) {
      return responseMessage;
    }

    if (
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT'
    ) {
      return 'Server response timed out. Please try again.';
    }

    if (!error.response) {
      return 'Could not connect to the server. Check your internet connection and API URL.';
    }

    return 'Something went wrong. Please try again.';
  }

  return error instanceof Error
    ? error.message
    : 'Something went wrong. Please try again.';
}
