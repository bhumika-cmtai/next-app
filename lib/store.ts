import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/userSlice';
import leadReducer from './redux/leadSlice';
import contactReducer from './redux/contactSlice';
import clientReducer from './redux/clientSlice';
import authReducer from './redux/authSlice';
import linkReducer from './redux/linkSlice'
import applinkReducer from './redux/appLinkSlice'
export const store = configureStore({
  reducer: {
    users: userReducer,
    leads: leadReducer,
    contacts: contactReducer,
    auth: authReducer,
    clients: clientReducer,
    links: linkReducer,
    applinks: applinkReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;