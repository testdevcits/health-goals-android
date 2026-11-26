import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { authenticatedRequest } from '../services/authenticatedApi';
import { API_ENDPOINTS } from '../constants';
import { apiErrorMessage } from '../services/api';

export type TodayActivityTotals = {
  steps?: number;
  workoutMinutes?: number;
  meditationMinutes?: number;
};

export type TodayActivityResponse = {
  totals?: TodayActivityTotals;
  creditedCoins?: number;
};

export type HistoryItem = {
  day: string;
  creditedCoins?: number;
  totals?: TodayActivityTotals;
};

export type HistoryResponse = {
  items: HistoryItem[];
};

export type ActivityState = {
  todayTotals: TodayActivityTotals;
  todayCreditedCoins: number;
  history: HistoryItem[];
  streak: number;
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
};

const initialState: ActivityState = {
  todayTotals: {
    steps: 0,
    workoutMinutes: 0,
    meditationMinutes: 0,
  },
  todayCreditedCoins: 0,
  history: [],
  streak: 0,
  loading: false,
  error: null,
  lastFetchedAt: null,
};

// ── Async Thunks ────────────────────────────────────────────────────────────

export const fetchTodayActivity = createAsyncThunk<
  {
    today: TodayActivityResponse;
    history: HistoryItem[];
  },
  { force?: boolean } | void,
  { state: { activity: ActivityState }; rejectValue: string }
>('activity/fetchToday', async (params, { getState, rejectWithValue }) => {
  const { lastFetchedAt, todayTotals, history } = getState().activity;
  const now = Date.now();
  const CACHE_TTL_MS = 60 * 1000; // 1-minute TTL cache

  if (
    !params?.force &&
    lastFetchedAt &&
    now - lastFetchedAt < CACHE_TTL_MS &&
    (todayTotals.steps !== undefined || history.length > 0)
  ) {
    return {
      today: {
        totals: todayTotals,
        creditedCoins: getState().activity.todayCreditedCoins,
      },
      history,
    };
  }

  try {
    const [todayResult, historyResult] = await Promise.all([
      authenticatedRequest<TodayActivityResponse>(
        'GET',
        API_ENDPOINTS.ACTIVITY.TODAY,
      ),
      authenticatedRequest<HistoryResponse>(
        'GET',
        `${API_ENDPOINTS.ACTIVITY.HISTORY}?limit=30`,
      ),
    ]);

    return {
      today: todayResult,
      history: historyResult.items || [],
    };
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

// ── Slice ───────────────────────────────────────────────────────────────────

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setTodayTotals(state, action: PayloadAction<TodayActivityTotals>) {
      state.todayTotals = { ...state.todayTotals, ...action.payload };
    },
    updateTodaySteps(state, action: PayloadAction<number>) {
      state.todayTotals.steps = action.payload;
    },
    setStreak(state, action: PayloadAction<number>) {
      state.streak = action.payload;
    },
    clearActivity(state) {
      state.todayTotals = {
        steps: 0,
        workoutMinutes: 0,
        meditationMinutes: 0,
      };
      state.todayCreditedCoins = 0;
      state.history = [];
      state.streak = 0;
      state.lastFetchedAt = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTodayActivity.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTodayActivity.fulfilled, (state, action) => {
      state.loading = false;
      state.todayTotals = action.payload.today.totals || {
        steps: 0,
        workoutMinutes: 0,
        meditationMinutes: 0,
      };
      state.todayCreditedCoins = action.payload.today.creditedCoins || 0;
      state.history = action.payload.history;
      state.lastFetchedAt = Date.now();
      state.error = null;
    });
    builder.addCase(fetchTodayActivity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to load activity data';
    });
  },
});

export const { setTodayTotals, updateTodaySteps, setStreak, clearActivity } =
  activitySlice.actions;

export default activitySlice.reducer;
