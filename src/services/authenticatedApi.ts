import axios from 'axios';
import { api } from './api';
import {
  expireSession,
  isExpiredTokenResponse,
  readSession,
  refreshSession,
} from './auth';

type ApiResponse<T> = {
  data: T;
};

export type AuthenticatedRequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const inFlightGetRequests = new Map<string, Promise<any>>();

async function executeAuthenticatedRequest<T = unknown>(
  method: AuthenticatedRequestMethod,
  path: string,
  body?: unknown,
  timeout = 30_000,
  expectedUserId?: string,
): Promise<T> {
  let session = await readSession();

  if (expectedUserId && session?.user?.id !== expectedUserId)
    throw new Error('Account changed. Please retry health sync.');
  if (!session?.accessToken) {
    throw new Error('Please sign in to continue.');
  }

  const send = (accessToken: string) =>
    api.request<ApiResponse<T>>({
      method,
      url: path,
      data: body,
      timeout,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

  try {
    const response = await send(session.accessToken);
    return response.data.data;
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      throw error;
    }

    session = await refreshSession();
    if (expectedUserId && session?.user?.id !== expectedUserId)
      throw new Error('Account changed. Please retry health sync.');
    if (!session?.accessToken) {
      if (isExpiredTokenResponse(error)) {
        await expireSession();
      }
      throw error;
    }

    try {
      const response = await send(session.accessToken);
      return response.data.data;
    } catch (retryError) {
      if (isExpiredTokenResponse(retryError)) {
        await expireSession();
      }
      throw retryError;
    }
  }
}

export async function authenticatedRequest<T = unknown>(
  method: AuthenticatedRequestMethod,
  path: string,
  body?: unknown,
  timeout = 30_000,
  expectedUserId?: string,
): Promise<T> {
  // Deduplicate concurrent in-flight GET requests to the exact same endpoint
  if (method === 'GET') {
    const dedupeKey = `${expectedUserId || 'user'}:${path}`;
    const inFlight = inFlightGetRequests.get(dedupeKey);
    if (inFlight) {
      return inFlight as Promise<T>;
    }
    const requestPromise = executeAuthenticatedRequest<T>(
      method,
      path,
      body,
      timeout,
      expectedUserId,
    ).finally(() => {
      inFlightGetRequests.delete(dedupeKey);
    });
    inFlightGetRequests.set(dedupeKey, requestPromise);
    return requestPromise;
  }

  return executeAuthenticatedRequest<T>(
    method,
    path,
    body,
    timeout,
    expectedUserId,
  );
}
