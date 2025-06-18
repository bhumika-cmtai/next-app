import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface Lead {
  _id?: string;
  name: string;
  email: string;
  phone: string;
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
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
  },
}); 

export const { setLeads, setLoading, setError, setSelectedLead, clearSelectedLead, setPagination, setCurrentPage } = leadSlice.actions;

export const fetchLeads = () => async (dispatch: Dispatch) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lead/getAllLeads`);
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
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lead/getLeadById/${id}`);
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

export const addLead = (lead: Lead) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lead/addLead`, lead);
    if (response.status === 201) {
      return response.data;
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const updateLead = (id: string, lead: Lead) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lead/updateLead/${id}`, lead);
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const deleteLead = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lead/deleteLead/${id}`);
    if (response.status === 200) {
      return response.data;   
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
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