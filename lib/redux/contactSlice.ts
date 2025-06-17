import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status?: string;
  createdOn?: string;
  updatedOn?: string;
}

interface ContactState {
  data: Contact[];
  loading: boolean;
  error: string | null;
  selectedContact: Contact | null;
}

const initialState: ContactState = {
  data: [],
  loading: false,
  error: null,
  selectedContact: null,
};  

const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setContacts: (state, action) => {
      state.data = action.payload;
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
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
  },
}); 

export const { setContacts, setLoading, setError, setSelectedContact, clearSelectedContact } = contactSlice.actions;

export const fetchContacts = () => async (dispatch: Dispatch) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/routes/contacts`);
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
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/routes/contacts/${id}`);
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
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/routes/contacts`, contact);
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
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/routes/contacts/${id}`, contact);
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
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/routes/contacts/${id}`);
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

export default contactSlice.reducer;