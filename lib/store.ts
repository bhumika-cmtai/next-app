// lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/userSlice';
import leadReducer from './redux/leadSlice';
import contactReducer from './redux/contactSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    leads: leadReducer,
    contacts: contactReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;