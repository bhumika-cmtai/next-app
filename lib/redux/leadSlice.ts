// change start
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface Lead {
  _id?: string;
  name: string;
  email: string;
  portal_Name: string;
  phoneNumber: string;
  qualification: string;
  city: string;
  date_of_birth: string;
  gender: string;
  message: string;
  source: string;
  status: string;
  createdOn?: string;
  updatedOn?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalLeads: number;
}

export interface LeadState {
  data: Lead[];
  loading: boolean;
  error: string | null;
  selectedLead: Lead | null;
  pagination: Pagination;
}

const initialState: LeadState = {
  data: [],
  loading: false,
  error: null,
  selectedLead: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
  },
};

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setLeads: (state, action) => {
      state.data = action.payload.leads;
      state.pagination.totalLeads = action.payload.totalLeads;
      state.pagination.totalPages = action.payload.totalPages;
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
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
      state.loading = false; // Ensure loading is false after selecting a single lead
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
  },
});

export const {
  setLeads,
  setLoading,
  setError,
  setSelectedLead,
  clearSelectedLead,
  setPagination,
  setCurrentPage,
} = leadSlice.actions;

// Updated to handle filtering, search, and pagination
export const fetchLeads = (params?: { search?: string; status?: string; page?: number }) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const query = [];
    if (params?.search) query.push(`searchQuery=${encodeURIComponent(params.search)}`);
    if (params?.status && params.status !== 'all') {
      query.push(`status=${encodeURIComponent(params.status)}`);
    }
    if (params?.page) query.push(`page=${params.page}`);
    const queryString = query.length ? `?${query.join("&")}` : "";

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leads/getAllLeads${queryString}`);
    
    if (response.status === 200) {
      dispatch(setLeads(response.data.data));
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
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leads/getLead/${id}`);
    const data: Lead = response.data;
    if (response.status === 200) {
      dispatch(setSelectedLead(data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

// Updated to handle loading state and return value
export const addLead = (lead: Lead) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leads/addLead`, lead);
    dispatch(setLoading(false));
    if (response.status === 201) {
      return response.data;
    } else {
      dispatch(setError(response.data.message));
      return null;
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
    return null;
  }
};

export const addManyLeads = (leads: Lead[]) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leads/addManyLead`, leads);
    dispatch(setLoading(false));  
    if (response.status === 201) {
      return response.data;
    } else {
      dispatch(setError(response.data.message));
      return null;
    }
  } catch (error: unknown) {  
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
    return null;
  }
};


// Updated to handle loading state and return value
export const updateLead = (id: string, lead: Lead) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leads/updateLead/${id}`, lead);
    dispatch(setLoading(false));
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch(setError(response.data.message));
      return null;
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
    return null;
  }
};

// Updated to handle loading state and return value
export const deleteLead = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leads/deleteLead/${id}`);
    dispatch(setLoading(false));
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch(setError(response.data.message));
      return null;
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
    return null;
  }
};

export const selectLeads = (state: RootState) => state.leads.data;
export const selectLeadById = (state: RootState) => state.leads.selectedLead;
export const selectLoading = (state: RootState) => state.leads.loading;
export const selectError = (state: RootState) => state.leads.error;
export const selectPagination = (state: RootState) => state.leads.pagination;
export const selectCurrentPage = (state: RootState) => state.leads.pagination.currentPage;
export const selectTotalPages = (state: RootState) => state.leads.pagination.totalPages;
export const selectTotalLeads = (state: RootState) => state.leads.pagination.totalLeads;

export default leadSlice.reducer;
// change end