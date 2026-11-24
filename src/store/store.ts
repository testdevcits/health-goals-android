import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import notificationReducer from './notificationSlice';
import walletReducer from './walletSlice';
import activityReducer from './activitySlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    notifications: notificationReducer,
    wallet: walletReducer,
    activity: activityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
