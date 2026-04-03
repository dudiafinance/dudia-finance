export interface Category {
  id: string;
  userId: string | null;
  name: string;
  icon: string | null;
  color: string | null;
  type: 'income' | 'expense';
  isDefault: boolean;
  createdAt: string;
}

export interface CategoryParams {
  type?: 'income' | 'expense';
}

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const categoriesApi = {
  getAll: async (params?: CategoryParams): Promise<Category[]> => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set('type', params.type);

    const query = searchParams.toString();
    return fetchAPI<Category[]>(`/categories${query ? `?${query}` : ''}`);
  },

  create: async (data: { name: string; icon?: string; color?: string; type: 'income' | 'expense' }): Promise<Category> => {
    return fetchAPI<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<{ name: string; icon?: string; color?: string; type: 'income' | 'expense' }>): Promise<Category> => {
    return fetchAPI<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};