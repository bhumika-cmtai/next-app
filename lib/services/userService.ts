
export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string; 
  phoneNumber: string;
  role: 'sales' | 'developer' | 'admin'; 
  status?: string;
  createdOn: string;
  updatedOn: string;
}

export interface GetAllUsersParams {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
}

export interface PaginatedUsersResponse {
    users: User[];
    totalPages: number;
    currentPage: number;
    totalUsers: number;
}

const API_BASE_URL = 'https://growup-backend.vercel.app/v1/user';

async function handleResponse<T>(response: Response): Promise<T> {
    const json = await response.json();
    if (!response.ok || json.errorCode !== 'NO') {
        throw new Error(json.errorMessage || 'An API error occurred');
    }
    return json.data;
}


export const userService = {
    getAllUsers: async (params: GetAllUsersParams = {}): Promise<PaginatedUsersResponse> => {
        const query = new URLSearchParams({
            page: params.page?.toString() || '1',
            limit: params.limit?.toString() || '10',
            ...(params.name && { name: params.name }),
            ...(params.email && { email: params.email }),
        });
        const response = await fetch(`${API_BASE_URL}/getAllUsers?${query}`);
        return handleResponse<PaginatedUsersResponse>(response);
    },

    getUserById: async (id: string): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/getUser/${id}`);
        return handleResponse<User>(response);
    },

    addUser: async (userData: Omit<User, '_id' | 'createdOn' | 'updatedOn'>): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/addUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse<User>(response);
    },

    updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/updateUser/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse<User>(response);
    },

    deleteUser: async (id: string): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/deleteUser/${id}`, {
            method: 'DELETE',
        });
        return handleResponse<User>(response);
    },
};