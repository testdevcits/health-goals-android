
import axios, {
  type InternalAxiosRequestConfig,
} from 'axios';
import { NativeModules } from 'react-native';

// ============================================
// API CONFIGURATION
// ============================================

const API_PATH = '/api/v1';

const DEFAULT_API_ORIGIN = 'https://health-goals-backend.vercel.app';

const configuredApiOrigin = String(
  NativeModules.HealthAppConfig?.apiBaseUrl ?? '',
)
  .trim()
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/i, '');

export const API_BASE_URL = `${configuredApiOrigin || DEFAULT_API_ORIGIN}${API_PATH}`;

if (__DEV__) {
  console.info('[API] Resolved base URL:', API_BASE_URL);
}

// ============================================
// AXIOS INSTANCE
// ============================================

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const SENSITIVE_FIELD =
  /password|passcode|otp|token|secret|authorization|cookie|api.?key|credential|email|phone|identifier|user.?id|query|search|redemption.?code|coupon|voucher|ticket.?number|ticket.?image|booking.?reference|profile.?image|image|base64|data.?uri/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizeValue(
  value: unknown,
  seen = new WeakSet<object>(),
): unknown {
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
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      SENSITIVE_FIELD.test(key)
        ? '[REDACTED]'
        : sanitizeValue(nestedValue, seen),
    ]),
  );
}

function sanitizeRequestPayload(value: unknown): unknown {
  if (typeof FormData !== 'undefined' && value instanceof FormData) {
    return '[FormData omitted]';
  }

  if (typeof value === 'string') {
    try {
      return sanitizeValue(JSON.parse(value));
    } catch {
      return '[STRING OMITTED]';
    }
  }

  return sanitizeValue(value);
}

function logHttpBlock(
  title: string,
  entries: Array<[label: string, value: unknown]>,
): void {
  console.info(`╔══════════════════ ${title} ══════════════════╗`);
  entries.forEach(([label, value]) => {
    console.info(`║ ${label}:`, value);
  });
  console.info('╚═════════════════════════════════════════════════════╝');
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

function getRequestDetails(config: InternalAxiosRequestConfig) {
  return {
    method: config.method?.toUpperCase() ?? 'UNKNOWN',
    url: sanitizeUrl(axios.getUri(config)),
  };
}

// ============================================
// DEVELOPMENT LOGGING
// ============================================

if (__DEV__) {
  const requestStartedAt = new WeakMap<object, number>();

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      requestStartedAt.set(config, Date.now());
      const headers =
        typeof config.headers?.toJSON === 'function'
          ? config.headers.toJSON()
          : config.headers;
      const entries: Array<[string, unknown]> = [
        ['METHOD', config.method?.toUpperCase() ?? 'UNKNOWN'],
        ['URL', getRequestDetails(config).url],
      ];

      if (config.params && Object.keys(config.params).length > 0) {
        entries.push(['PARAMS', sanitizeValue(config.params)]);
      }

      if (headers && Object.keys(headers).length > 0) {
        entries.push(['HEADERS', sanitizeValue(headers)]);
      }

      if (config.data !== undefined) {
        entries.push(['PAYLOAD', sanitizeRequestPayload(config.data)]);
      } else {
        entries.push(['PAYLOAD', 'None']);
      }

      logHttpBlock('🚀 HTTP REQUEST', entries);
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
      logHttpBlock('✅ HTTP RESPONSE', [
        ...Object.entries(getRequestDetails(response.config)),
        ['STATUS', `${response.status} ${response.statusText || 'OK'}`],
        [
          'DURATION',
          `${Date.now() -
            (requestStartedAt.get(response.config) ?? Date.now())}ms`,
        ],
        ['BODY', sanitizeValue(response.data)],
      ]);

      return response;
    },
    error => {
      if (axios.isAxiosError(error)) {
        const config = error.config;
        const entries: Array<[string, unknown]> = [
          ...(config ? Object.entries(getRequestDetails(config)) : []),
          ['STATUS', error.response?.status ?? 'NETWORK_ERROR'],
          ['ERROR', error.message],
          ['CODE', error.code],
        ];

        if (config) {
          entries.push([
            'DURATION',
            `${Date.now() -
              (requestStartedAt.get(config) ?? Date.now())}ms`,
          ]);
        }

        if (error.response?.data !== undefined) {
          entries.push(['RESPONSE BODY', sanitizeValue(error.response.data)]);
        }

        console.error('╔══════════════════ ❌ HTTP ERROR RESPONSE ═══════════╗');
        entries.forEach(([label, value]) => {
          console.error(`║ ${label}:`, value);
        });
        console.error('╚═════════════════════════════════════════════════════╝');
      } else {
        console.error('[API] Request failed', {
          code: 'UNKNOWN_ERROR',
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
