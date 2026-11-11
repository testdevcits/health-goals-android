import * as Keychain from 'react-native-keychain';
import { api } from './api';
import type { UserProfile } from './profile';

const KEYCHAIN_SERVICE = 'com.vitality.auth';
let refreshInFlight: Promise<AuthTokens | null> | null = null;
let sessionExpired = false;
const sessionExpiredListeners = new Set<() => void>();

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
};

type ApiResult<T> = { data: T };

async function saveTokens(
  data: AuthTokens,
  savePhoneProfile = false,
): Promise<AuthTokens> {
  await Keychain.setGenericPassword('session', JSON.stringify(data), {
    service: KEYCHAIN_SERVICE,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
  });
  sessionExpired = false;
  if (savePhoneProfile) {
    try {
      const { syncPhoneProfile } = await import('./devices');
      await syncPhoneProfile();
    } catch (error) {
      console.warn('Phone profile will be retried before health sync:', error);
    }
  }
  return data;
}

export async function requestLogin(email: string, password: string) {
  const response = await api.post<
    ApiResult<{
      challengeId: string;
      maskedEmail?: string;
      deliveryMode?: string;
    }>
  >('/auth/login', {
    identifier: email.trim(),
    password,
  });
  return response.data.data;
}

export async function requestRegistration(
  name: string,
  email: string,
  password: string,
  companyCode: string,
  goal: string,
) {
  const response = await api.post<
    ApiResult<{ challengeId: string; deliveryMode?: string }>
  >('/auth/register', {
    name: name.trim(),
    email: email.trim(),
    password,
    companyCode: companyCode.trim(),
    goal,
  });
  return response.data.data;
}

export async function verifyEmailCode(challengeId: string, otp: string) {
  const response = await api.post<ApiResult<AuthTokens>>('/auth/verify-otp', {
    challengeId,
    otp,
  });
  return saveTokens(response.data.data, true);
}

export async function requestPasswordReset(email: string) {
  const response = await api.post<
    ApiResult<{ challengeId?: string; deliveryMode?: string }>
  >('/auth/password/forgot', { email: email.trim() });
  return response.data.data;
}

export async function resetPassword(
  challengeId: string,
  otp: string,
  password: string,
) {
  await api.post('/auth/password/reset', { challengeId, otp, password });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ passwordChanged: boolean; requiresSignIn: boolean }> {
  const { authenticatedRequest } = await import('./authenticatedApi');
  return authenticatedRequest<{
    passwordChanged: boolean;
    requiresSignIn: boolean;
  }>('PATCH', '/auth/me/password', { currentPassword, newPassword });
}

export async function signInWithGoogle(idToken: string) {
  const response = await api.post<ApiResult<AuthTokens>>('/auth/google', {
    idToken,
  });
  return saveTokens(response.data.data, true);
}

export async function readSession(): Promise<AuthTokens | null> {
  const credentials = await Keychain.getGenericPassword({
    service: KEYCHAIN_SERVICE,
  });
  if (!credentials) return null;
  try {
    return JSON.parse(credentials.password) as AuthTokens;
  } catch (error) {
    await clearSession();
    if (isExpiredTokenResponse(error)) notifySessionExpired();
    return null;
  }
}

export async function restoreSession(): Promise<AuthTokens | null> {
  const session = await readSession();
  if (!session?.refreshToken) return null;
  try {
    const response = await api.post<ApiResult<AuthTokens>>('/auth/refresh', {
      refreshToken: session.refreshToken,
    });
    const refreshed = response.data.data;
    const profile = await api.get<ApiResult<{ user: UserProfile }>>(
      '/auth/me',
      {
        headers: { Authorization: `Bearer ${refreshed.accessToken}` },
      },
    );
    return saveTokens({ ...refreshed, user: profile.data.data.user }, true);
  } catch {
    await clearSession();
    return null;
  }
}

export async function refreshSession(): Promise<AuthTokens | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = refreshSessionOnce().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

export const isExpiredTokenResponse = (error: unknown): boolean => {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('response' in error) ||
    typeof error.response !== 'object' ||
    error.response === null ||
    !('status' in error.response) ||
    error.response.status !== 401 ||
    !('data' in error.response)
  ) {
    return false;
  }

  const data = error.response.data;
  const messages: string[] = [];
  if (typeof data === 'string') messages.push(data);
  if (typeof data === 'object' && data !== null) {
    if ('message' in data && typeof data.message === 'string') {
      messages.push(data.message);
    }
    if ('error' in data && typeof data.error === 'string') {
      messages.push(data.error);
    }
    if ('data' in data && typeof data.data === 'object' && data.data !== null) {
      if ('message' in data.data && typeof data.data.message === 'string') {
        messages.push(data.data.message);
      }
    }
  }

  return messages.some(message =>
    /\b(invalid|expired)\b.*\b(token|jwt|credential)\b|\b(token|jwt|credential)\b.*\b(invalid|expired)\b/i.test(
      message,
    ),
  );
};

const notifySessionExpired = () => {
  if (sessionExpired) return;
  sessionExpired = true;
  sessionExpiredListeners.forEach(listener => listener());
};

export const subscribeToSessionExpired = (listener: () => void) => {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
};

export async function expireSession() {
  if (sessionExpired) return;
  sessionExpired = true;
  try {
    await logout();
  } finally {
    sessionExpiredListeners.forEach(listener => listener());
  }
}

async function refreshSessionOnce(): Promise<AuthTokens | null> {
  const session = await readSession();
  if (!session?.refreshToken) return null;
  try {
    const response = await api.post<ApiResult<AuthTokens>>('/auth/refresh', {
      refreshToken: session.refreshToken,
    });
    return saveTokens({ ...response.data.data, user: session.user });
  } catch (error) {
    await clearSession();
    if (isExpiredTokenResponse(error)) notifySessionExpired();
    return null;
  }
}

export async function logout() {
  const session = await readSession();
  await clearSession();
  if (session?.accessToken) {
    void api
      .post(
        '/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${session.accessToken}` } },
      )
      .catch(() => {});
  }
}

export async function clearSession() {
  await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
}
