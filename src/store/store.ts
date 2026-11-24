import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
