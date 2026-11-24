import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchWallet, type Wallet, type DailyActivity } from '../services/wallet';
import { apiErrorMessage } from '../services/api';

export type WalletState = {
  wallet: Wallet | null;
  dailyActivity: DailyActivity | null;
  availablePoints: number;
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
};

const initialState: WalletState = {
  wallet: null,
  dailyActivity: null,
  availablePoints: 0,
  loading: false,
  error: null,
  lastFetchedAt: null,
};

// ── Async Thunks ────────────────────────────────────────────────────────────

export const getWalletData = createAsyncThunk<
  { wallet: Wallet; dailyActivity: DailyActivity },
  { force?: boolean } | void,
  { state: { wallet: WalletState }; rejectValue: string }
>('wallet/fetch', async (params, { getState, rejectWithValue }) => {
  const { lastFetchedAt, wallet, dailyActivity } = getState().wallet;
  const now = Date.now();
  const CACHE_TTL_MS = 60 * 1000; // 1-minute TTL cache

  // Use cached data if not forced and still fresh
  if (!params?.force && lastFetchedAt && now - lastFetchedAt < CACHE_TTL_MS && wallet && dailyActivity) {
    return { wallet, dailyActivity };
  }

  try {
    const response = await fetchWallet();
    return {
      wallet: response.wallet,
      dailyActivity: response.dailyActivity,
    };
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

// ── Slice ───────────────────────────────────────────────────────────────────

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletData(
      state,
      action: PayloadAction<{ wallet: Wallet; dailyActivity?: DailyActivity }>,
    ) {
      state.wallet = action.payload.wallet;
      state.availablePoints = action.payload.wallet.availablePoints;
      if (action.payload.dailyActivity) {
        state.dailyActivity = action.payload.dailyActivity;
      }
      state.lastFetchedAt = Date.now();
      state.error = null;
    },
    deductPoints(state, action: PayloadAction<number>) {
      const deduction = action.payload;
      state.availablePoints = Math.max(0, state.availablePoints - deduction);
      if (state.wallet) {
        state.wallet.availablePoints = state.availablePoints;
        state.wallet.lifetimeRedeemed += deduction;
      }
    },
    addPoints(state, action: PayloadAction<number>) {
      const addition = action.payload;
      state.availablePoints += addition;
      if (state.wallet) {
        state.wallet.availablePoints = state.availablePoints;
        state.wallet.lifetimeEarned += addition;
      }
    },
    clearWallet(state) {
      state.wallet = null;
      state.dailyActivity = null;
      state.availablePoints = 0;
      state.lastFetchedAt = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(getWalletData.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getWalletData.fulfilled, (state, action) => {
      state.loading = false;
      state.wallet = action.payload.wallet;
      state.dailyActivity = action.payload.dailyActivity;
      state.availablePoints = action.payload.wallet.availablePoints;
      state.lastFetchedAt = Date.now();
      state.error = null;
    });
    builder.addCase(getWalletData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to load wallet data';
    });
  },
});

export const { setWalletData, deductPoints, addPoints, clearWallet } =
  walletSlice.actions;

export default walletSlice.reducer;
