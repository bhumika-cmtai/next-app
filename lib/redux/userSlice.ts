import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface User {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  password?: string;
  status?: string;
  tlcode?:string;
  createdOn?: string;
  updatedOn?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export interface UserState {
  data: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
  pagination: Pagination;
}

const initialState: UserState = {
  data: [],
  loading: false,
  error: null,
  selectedUser: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  },
};  

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.data = action.payload.users;
      state.pagination.totalPages = action.payload.totalPages;
      state.pagination.totalUsers = action.payload.totalUsers;
      state.pagination.currentPage = action.payload.currentPage;
      state.loading = false;
      state.error = null;
    },  
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
}); 

export const { setUsers, setLoading, setError, setSelectedUser, clearSelectedUser, setCurrentPage } = userSlice.actions;

export const fetchUsers = (params?: { search?: string; status?: string; page?: number }) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const query = [];
    if (params?.search) query.push(`searchQuery=${encodeURIComponent(params.search)}`);
    if (params?.status && params.status !== 'all') query.push(`status=${encodeURIComponent(params.status)}`);
    if (params?.page) query.push(`page=${params.page}`);
    const queryString = query.length ? `?${query.join('&')}` : '';
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/getallUsers${queryString}`);
    if (response.status === 200) {
      dispatch(setUsers(response.data.data));
      if (params?.page) dispatch(setCurrentPage(params.page));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const fetchLeadById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/getUser/${id}`);
        const data: User = response.data;
    if (response.status === 200) {
      dispatch(setSelectedUser(data));    
      dispatch(setLoading(false)); 
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const addUser = (user: User) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/addUser`, user);
    if (response.status === 201) {
      dispatch(setLoading(false));
      return response.data;
    } else {
      dispatch(setError(response.data.message));
      return null;
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const addManyUsers = (users: User[]) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/addManyUser`, users);
    if (response.status === 201) {
      return response.data;
      dispatch(setLoading(false));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const updateUser = (id: string, user: User) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/updateUser/${id}`, user);
    if (response.status === 200) {
      dispatch(setLoading(false));
      return response.data;
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const deleteUser = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/deleteUser/${id}`);
    if (response.status === 200) {
      dispatch(setLoading(false));
      return response.data;   
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};
export const fetchTlCode = (tlcode: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/getTlCode/${tlcode}`);
        const data: User = response.data;
    if (response.status === 200) { 
      dispatch(setLoading(false)); 
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const selectUsers = (state: RootState) => state.users.data;
export const selectUserById = (state: RootState) => state.users.selectedUser;
export const selectLoading = (state: RootState) => state.users.loading;
export const selectError = (state: RootState) => state.users.error;
export const selectPagination = (state: RootState) => state.users.pagination;
export const selectCurrentPage = (state: RootState) => state.users.pagination.currentPage;
export const selectTotalPages = (state: RootState) => state.users.pagination.totalPages;
export const selectTotalUsers = (state: RootState) => state.users.pagination.totalUsers;

export default userSlice.reducer;