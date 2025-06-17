// lib/redux/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService, User, PaginatedUsersResponse, GetAllUsersParams } from '../services/userService';

interface UserState extends PaginatedUsersResponse {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    users: [],
    totalPages: 1,
    currentPage: 1,
    totalUsers: 0,
    status: 'idle',
    error: null,
};

// Async Thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (params: GetAllUsersParams, { rejectWithValue }) => {
    try {
        const data = await userService.getAllUsers(params);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const addNewUser = createAsyncThunk('users/addNewUser', async (userData: Omit<User, '_id' | 'createdOn' | 'updatedOn'>, { rejectWithValue }) => {
    try {
        const data = await userService.addUser(userData);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, userData }: { id: string; userData: Partial<User> }, { rejectWithValue }) => {
    try {
        const data = await userService.updateUser(id, userData);
        return data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string, { rejectWithValue }) => {
    try {
        await userService.deleteUser(id);
        return id; // Return the id of the deleted user
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});


const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<PaginatedUsersResponse>) => {
                state.status = 'succeeded';
                state.users = action.payload.users;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalUsers = action.payload.totalUsers;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Add User
            .addCase(addNewUser.fulfilled, (state, action: PayloadAction<User>) => {
                // For simplicity, we can just refetch the list to ensure pagination is correct
                // or optimistically add it if not on the last page.
                // Refetching is simpler and more reliable.
                state.status = 'idle'; // Trigger a refetch on the page
            })
            // Update User
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
                state.users = state.users.filter(user => user._id !== action.payload);
                state.totalUsers -= 1;
            });
    },
});

export default userSlice.reducer;