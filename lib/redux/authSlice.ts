// authSlice.ts

import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface User {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  status: string;
  role: string; // Ensure role is part of the User interface
  createdOn: string;
  updatedOn: string;
}

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  users: [],
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
    setUsers: (state, action) => {
      state.users = action.payload;
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
    },
  },
});


export const { setUser, setUsers, setIsLoading, setError, logoutUser } = authSlice.actions;

export const login = ({ email, password }: { email: string; password: string }) => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  dispatch(setError(null));

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/login`, { email, password });
    console.log(response)
    if (response.status === 200 && response.data?.data?.user && response.data?.data?.token) {
      const { user, token } = response.data.data;
    
      dispatch(setUser(user));
      return { user, token };
    } else {
      const errorMessage = response.data?.errorMessage || "Login failed: Invalid response from server.";
      dispatch(setError(errorMessage));
      return null;
    }
  } catch (error: unknown) {
    let message = "An unknown error occurred.";

    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.errorMessage || error.message || "Login failed.";
    } else if (error instanceof Error) {
      message = error.message;
    }
    
    dispatch(setError(message));
    return null;
  } 
};



export const logout = () => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  try {
    // You may want to call an API endpoint to invalidate the token server-side
    // For now, we'll just clear the client state.
    // await axios.post("/api/auth/logout"); 
    dispatch(logoutUser());
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Logout failed";
    dispatch(setError(message));
  } finally {
    dispatch(setIsLoading(false));
  }
};


// Other thunks like registerUser...

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectUsers = (state: RootState) => state.auth.users;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;