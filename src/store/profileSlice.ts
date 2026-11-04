import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../services/profile';

type ProfileState = {
  user: UserProfile | null;
};

const initialState: ProfileState = {
  user: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
    },
    updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearProfile(state) {
      state.user = null;
    },
  },
});

export const { clearProfile, setProfile, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
