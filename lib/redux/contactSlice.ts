import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status?: string;
  createdOn?: string;
  updatedOn?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalContacts: number;
}

interface ContactState {
  data: Contact[];
  loading: boolean;
  error: string | null;
  selectedContact: Contact | null;
  pagination: Pagination;
}

const initialState: ContactState = {
  data: [],
  loading: false,
  error: null,
  selectedContact: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
  },
  };  

const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setContacts: (state, action) => {
      state.data = action.payload.contacts;
      state.pagination.totalContacts = action.payload.totalContacts;
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
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
  },
}); 

export const { setContacts, setLoading, setError, setSelectedContact, clearSelectedContact, setPagination, setCurrentPage } = contactSlice.actions;

export const fetchContacts = () => async (dispatch: Dispatch) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts/getAllContact`);
    if (response.status === 200) {
      dispatch(setContacts(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const fetchContactById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts/getContact/${id}`);
    const data: Contact = response.data;
    if (response.status === 200) {
      dispatch(setSelectedContact(data));    
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const addContact = (contact: Contact) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts/addContact`, contact);
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

export const updateContact = (id: string, contact: Contact) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts/updateContact/${id}`, contact);
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

export const deleteContact = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts/deleteContact/${id}`);
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

export const selectContacts = (state: RootState) => state.contacts.data;
export const selectContactById = (state: RootState) => state.contacts.selectedContact;
export const selectLoading = (state: RootState) => state.contacts.loading;
export const selectError = (state: RootState) => state.contacts.error;
export const selectPagination = (state: RootState) => state.contacts.pagination;
export const selectCurrentPage = (state: RootState) => state.contacts.pagination.currentPage;
export const selectTotalPages = (state: RootState) => state.contacts.pagination.totalPages;
export const selectTotalContacts = (state: RootState) => state.contacts.pagination.totalContacts;

export default contactSlice.reducer;