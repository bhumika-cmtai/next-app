import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { leadService, Lead, PaginatedLeadsResponse, GetAllLeadsParams } from '../services/leadService';

interface LeadState extends PaginatedLeadsResponse {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: LeadState = {
    leads: [],
    totalPages: 1,
    currentPage: 1,
    totalLeads: 0,
    status: 'idle',
    error: null,
};

// Async Thunks
export const fetchLeads = createAsyncThunk('lead/fetchLeads', async (params: GetAllLeadsParams, { rejectWithValue }) => {
    try {
        const data = await leadService.getAllLeads(params);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const addNewLead = createAsyncThunk('lead/addNewLead', async (leadData: Omit<Lead, '_id' | 'createdOn' | 'updatedOn'>, { rejectWithValue }) => {
    try {
        const data = await leadService.addLead(leadData);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const updateLead = createAsyncThunk('lead/updateLead', async ({ id, userData }: { id: string; userData: Partial<Lead> }, { rejectWithValue }) => {
    try {
        const data = await leadService.updateLead(id, userData);
        console.log(userData)
        console.log(data)
        return data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const deleteLead = createAsyncThunk('lead/deleteLead', async (id: string, { rejectWithValue }) => {
    try {
        await leadService.deleteLead(id);
        return id; 
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});


const leadSlice = createSlice({
    name: 'leads',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeads.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLeads.fulfilled, (state, action: PayloadAction<PaginatedLeadsResponse>) => {
                state.status = 'succeeded';
                state.leads = action.payload.leads;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalLeads = action.payload.totalLeads;
            })
            .addCase(fetchLeads.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Add Lead
            .addCase(addNewLead.fulfilled, (state, action: PayloadAction<Lead>) => {
                // For simplicity, we can just refetch the list to ensure pagination is correct
                // or optimistically add it if not on the last page.
                state.status = 'idle'; // Trigger a refetch on the page
            })
            // Update Lead
            .addCase(updateLead.fulfilled, (state, action: PayloadAction<Lead>) => {
                const index = state.leads.findIndex(lead => lead._id === action.payload._id);
                if (index !== -1) {
                    state.leads[index] = action.payload;
                }
            })
            // Delete Lead
            .addCase(deleteLead.fulfilled, (state, action: PayloadAction<string>) => {
                state.leads = state.leads.filter(lead => lead._id !== action.payload);
                state.totalLeads -= 1;
            });
    },
});

export default leadSlice.reducer;