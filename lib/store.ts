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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;