import axios from 'axios';
import { api } from './api';

type ApiResponse<T> = {
  data: T;
};

export type AuthenticatedRequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export async function authenticatedRequest<T = unknown>(
  method: AuthenticatedRequestMethod,
  path: string,
  body?: unknown,
  timeout = 15_000,
): Promise<T> {
  const { readSession, refreshSession } = await import('./auth');
  let session = await readSession();

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
    if (!session?.accessToken) {
      throw error;
    }

    const response = await send(session.accessToken);
    return response.data.data;
  }
}
