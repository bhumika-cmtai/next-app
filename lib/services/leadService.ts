
export interface Lead {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: 'New' | 'Contacted' | 'NotInterested';
  createdOn: string;
  updatedOn: string;
}

export interface GetAllLeadsParams {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
}

export interface PaginatedLeadsResponse {
    leads: Lead[];
    totalPages: number;
    currentPage: number;
    totalLeads: number; 
}

const API_BASE_URL = 'https://growup-backend.vercel.app/v1/lead';

async function handleResponse<T>(response: Response): Promise<T> {
    const json = await response.json();
    if (!response.ok || json.errorCode !== 'NO') {
        throw new Error(json.errorMessage || 'An API error occurred');
    }
    return json.data;
}

export const leadService = {
    getAllLeads: async (params: GetAllLeadsParams = {}): Promise<PaginatedLeadsResponse> => {
        const query = new URLSearchParams({
            page: params.page?.toString() || '1',
            limit: params.limit?.toString() || '10',
            ...(params.name && { name: params.name }),
            ...(params.email && { email: params.email }),
        });
        const response = await fetch(`${API_BASE_URL}/getAllLeads?${query}`);
        return handleResponse<PaginatedLeadsResponse>(response);
    },

    getLeadById: async (id: string): Promise<Lead> => {
        const response = await fetch(`${API_BASE_URL}/getLead/${id}`);
        return handleResponse<Lead>(response);
    },

    addLead: async (leadData: Omit<Lead, '_id' | 'createdOn' | 'updatedOn'>): Promise<Lead> => {
        const response = await fetch(`${API_BASE_URL}/addLead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData),
        });
        return handleResponse<Lead>(response);
    },

    updateLead: async (id: string, leadData: Partial<Lead>): Promise<Lead> => {
        const response = await fetch(`${API_BASE_URL}/updateLead/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData),
        });
        console.log(leadData)
        console.log(response)
        return handleResponse<Lead>(response);
    },

    deleteLead: async (id: string): Promise<Lead> => {
        const response = await fetch(`${API_BASE_URL}/deleteLead/${id}`, {
            method: 'DELETE',
        });
        const json = await response.json();
        if (!response.ok || json.errorCode !== 'NO') {
            throw new Error(json.errorMessage || 'An API error occurred');
        }
        return json.data;
    },
};