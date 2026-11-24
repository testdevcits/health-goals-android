import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authenticatedRequest } from '../services/authenticatedApi';
import { API_ENDPOINTS } from '../constants';
import { apiErrorMessage } from '../services/api';

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

type NotificationPageResponse = {
  items?: NotificationItem[];
  unread?: number;
};

export type NotificationState = {
  items: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
};

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetchedAt: null,
};

// ── Async Thunks ────────────────────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk<
  { items: NotificationItem[]; unreadCount: number },
  { force?: boolean } | void,
  { state: { notifications: NotificationState }; rejectValue: string }
>('notifications/fetch', async (params, { getState, rejectWithValue }) => {
  const { lastFetchedAt, items } = getState().notifications;
  const now = Date.now();
  const CACHE_TTL_MS = 60 * 1000; // 1 minute cache TTL

  // If not forced and recently fetched (within 1 min), return current state
  if (!params?.force && lastFetchedAt && now - lastFetchedAt < CACHE_TTL_MS && items.length > 0) {
    const unreadCount = items.filter(item => !item.read).length;
    return { items, unreadCount };
  }

  try {
    const result = await authenticatedRequest<NotificationPageResponse>(
      'GET',
      API_ENDPOINTS.NOTIFICATIONS.LIST(1, 50),
    );
    const fetchedItems = result.items || [];
    const unreadCount =
      result.unread ?? fetchedItems.filter(item => !item.read).length;
    return { items: fetchedItems, unreadCount };
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

export const markNotificationAsRead = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('notifications/markAsRead', async (id, { rejectWithValue }) => {
  try {
    await authenticatedRequest(
      'PATCH',
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id),
    );
    return id;
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

export const markAllNotificationsAsRead = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('notifications/markAllAsRead', async (_, { rejectWithValue }) => {
  try {
    await authenticatedRequest('PATCH', API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

// ── Slice ───────────────────────────────────────────────────────────────────

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(
      state,
      action: PayloadAction<{ items: NotificationItem[]; unreadCount?: number }>,
    ) {
      state.items = action.payload.items;
      state.unreadCount =
        action.payload.unreadCount ??
        action.payload.items.filter(item => !item.read).length;
      state.lastFetchedAt = Date.now();
      state.error = null;
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    decrementUnreadCount(state) {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
      state.lastFetchedAt = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    // fetchNotifications
    builder.addCase(fetchNotifications.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.unreadCount = action.payload.unreadCount;
      state.lastFetchedAt = Date.now();
      state.error = null;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch notifications';
    });

    // markNotificationAsRead
    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      const targetId = action.payload;
      const item = state.items.find(i => i.id === targetId);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });

    // markAllNotificationsAsRead
    builder.addCase(markAllNotificationsAsRead.fulfilled, state => {
      state.items.forEach(item => {
        item.read = true;
      });
      state.unreadCount = 0;
    });
  },
});

export const {
  setNotifications,
  setUnreadCount,
  decrementUnreadCount,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
