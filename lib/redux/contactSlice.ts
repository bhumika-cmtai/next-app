// lib/redux/contactSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { contactService, PaginatedContactsResponse, GetAllContactsParams } from '../services/contactService';
import type { Contact } from '../services/contactService';

interface ContactState extends PaginatedContactsResponse {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ContactState = {
    contacts: [],
    totalPages: 1,
    currentPage: 1,
    totalContacts: 0,
    status: 'idle',
    error: null,
};

export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async (params: GetAllContactsParams, { rejectWithValue }) => {
    try { return await contactService.getAllContacts(params); } 
    catch (error: any) { return rejectWithValue(error.message); }
});

export const addNewContact = createAsyncThunk('contacts/addNewContact', async (contactData: Omit<Contact, '_id' | 'createdOn' | 'updatedOn'>, { rejectWithValue }) => {
    try { return await contactService.addContact(contactData); } 
    catch (error: any) { return rejectWithValue(error.message); }
});

export const updateContact = createAsyncThunk('contacts/updateContact', async ({ id, userData }: { id: string; userData: Partial<Contact> }, { rejectWithValue }) => {
    try { return await contactService.updateContact(id, userData); } 
    catch (error: any) { return rejectWithValue(error.message); }
});

export const deleteContact = createAsyncThunk('contacts/deleteContact', async (id: string, { rejectWithValue }) => {
    try { await contactService.deleteContact(id); return id; } 
    catch (error: any) { return rejectWithValue(error.message); }
});

const contactSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchContacts.fulfilled, (state, action: PayloadAction<PaginatedContactsResponse>) => {
                state.status = 'succeeded';
                state.contacts = action.payload.contacts;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalContacts = action.payload.totalContacts;
            })
            .addCase(fetchContacts.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            // .addCase(addNewContact.fulfilled, (state) => { state.status = 'idle'; })
            .addCase(updateContact.fulfilled, (state, action: PayloadAction<Contact>) => {
                const index = state.contacts.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.contacts[index] = action.payload;
            })
            .addCase(deleteContact.fulfilled, (state, action: PayloadAction<string>) => {
                state.contacts = state.contacts.filter(c => c._id !== action.payload);
                state.totalContacts -= 1;
            });
    },
});

export default contactSlice.reducer;