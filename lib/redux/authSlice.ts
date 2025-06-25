// lib/redux/authSlice.ts (Fully Updated)

import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import Cookies from 'js-cookie';

// 1. EXPAND User interface to match your Mongoose schema exactly
export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string; // Should not be stored in frontend state, but good to have in type
  phoneNumber: string;
  whatsappNumber?: string;
  city?: string;
  role: string;
  status: string;
  createdOn: string;
  updatedOn: string;
  leaderCode?: string;
  work_experience?: string;
  abhi_aap_kya_karte_hai?: string;
  bio?: string;
  age?: number;
  account_number?: string;
  Ifsc?: string;
  upi_id?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      Cookies.remove('auth-token'); // Also remove the cookie on logout
    },
  },
});

export const { setUser, setIsLoading, setError, logoutUser } = authSlice.actions;

// Your existing login thunk (no changes needed)
export const login = ({ email, password }: { email: string; password: string }) => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  dispatch(setError(null));
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/login`, { email, password });
    if (response.status === 200 && response.data?.data?.user && response.data?.data?.token) {
      const { user, token } = response.data.data;
      dispatch(setUser(user));
      return { user, token };
    } else {
      const errorMessage = response.data?.errorMessage || "Login failed.";
      dispatch(setError(errorMessage));
      return null;
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An unknown error occurred.";
    dispatch(setError(message));
    return null;
  } 
};

// 2. NEW THUNK: Fetch current user's full details
export const fetchCurrentUser = () => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  const token = Cookies.get('auth-token');
  if (!token) {
    dispatch(setError("Authentication token not found."));
    return;
  }
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    dispatch(setUser(response.data.data));
  } catch (error: any) {
    const message = error.response?.data?.message || "Could not fetch user details.";
    dispatch(setError(message));
    if(error.response?.status === 401) { // If token is invalid/expired
        dispatch(logoutUser());
    }
  }
};

// 3. NEW THUNK: Update user's profile details
export const updateUserProfile = (profileData: Partial<User>) => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  const token = Cookies.get('auth-token');
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update-profile`, profileData, {
       headers: { 'Authorization': `Bearer ${token}` }
    });
    dispatch(setUser(response.data.data)); // Update user state with fresh data from backend
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update profile.";
    dispatch(setError(message));
    return null;
  }
};

// 4. NEW THUNK: Update user's bank details
export const updateBankDetails = (bankData: Partial<User>) => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  const token = Cookies.get('auth-token');
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update-bank`, bankData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    dispatch(setUser(response.data.data)); // Update user state with fresh data
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update bank details.";
    dispatch(setError(message));
    return null;
  }
};

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;