import { NativeModules } from 'react-native';
import { io, type Socket } from 'socket.io-client';
import { API_BASE_URL } from './api';
import { readSession, refreshSession } from './auth';

const configuredUrl = String(
  NativeModules.HealthAppConfig?.chatSocketUrl || '',
).trim();
export const CHAT_SOCKET_URL = (
  configuredUrl || (__DEV__ ? API_BASE_URL.replace(/\/api\/v1\/?$/, '') : '')
).replace(/\/$/, '');

export async function createAuthenticatedChatSocket(): Promise<{
  socket: Socket;
  userId: string;
}> {
  const session = await readSession();
  if (!session?.accessToken)
    throw new Error('Please sign in to use group chat.');
  if (!CHAT_SOCKET_URL)
    throw new Error('Chat server URL is not configured for this build.');

  const socket = io(CHAT_SOCKET_URL, {
    autoConnect: false,
    auth: { token: session.accessToken },
    reconnection: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
  });
  let refreshInFlight = false;
  socket.on('connect_error', async (error: any) => {
    if (error?.data?.code !== 'AUTH_REQUIRED' || refreshInFlight) return;
    refreshInFlight = true;
    try {
      const refreshed = await refreshSession();
      if (!refreshed?.accessToken) {
        socket.disconnect();
        return;
      }
      socket.auth = { token: refreshed.accessToken };
      socket.connect();
    } finally {
      refreshInFlight = false;
    }
  });
  return { socket, userId: session.user.id };
}
