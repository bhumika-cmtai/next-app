
export interface Contact {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  status: 'New' | 'Contacted' | 'NotInterested'; 
  createdOn: string;
  updatedOn: string;
}

export interface GetAllContactsParams {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
}

export interface PaginatedContactsResponse {
    contacts: Contact[];
    totalPages: number;
    currentPage: number;
    totalContacts: number;
}

const API_BASE_URL = 'https://growup-backend.vercel.app/v1/contact';

async function handleResponse<T>(response: Response): Promise<T> {
    const json = await response.json();
    if (!response.ok || json.errorCode !== 'NO') {
        throw new Error(json.errorMessage || 'An API error occurred');
    }
    return json.data;
}

export const contactService = {
    getAllContacts: async (params: GetAllContactsParams = {}): Promise<PaginatedContactsResponse> => {
        const query = new URLSearchParams({
            page: params.page?.toString() || '1',
            limit: params.limit?.toString() || '10',
            ...(params.name && { name: params.name }),
            ...(params.email && { email: params.email }),
        });
        const response = await fetch(`${API_BASE_URL}/getAllContact?${query}`);
        console.log(response)
        return handleResponse<PaginatedContactsResponse>(response);
    },

    addContact: async (contactData: Omit<Contact, '_id' | 'createdOn' | 'updatedOn'>): Promise<Contact> => {
        const response = await fetch(`${API_BASE_URL}/addContact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData),
        });
        return handleResponse<Contact>(response);
    },

    updateContact: async (id: string, contactData: Partial<Contact>): Promise<Contact> => {
        const response = await fetch(`${API_BASE_URL}/updateContact/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData),
        });
        return handleResponse<Contact>(response);
    },

    deleteContact: async (id: string): Promise<Contact> => {
        const response = await fetch(`${API_BASE_URL}/deleteContact/${id}`, {
            method: 'DELETE',
        });
        const json = await response.json();
        if (!response.ok || json.errorCode !== 'NO') {
            throw new Error(json.errorMessage || 'An API error occurred');
        }
        return json.data;
    },
};