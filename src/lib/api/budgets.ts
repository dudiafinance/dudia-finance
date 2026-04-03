export interface Budget {
  id: string;
  userId: string;
  categoryId: string | null;
  month: number;
  year: number;
  amount: string;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    type: 'income' | 'expense';
  } | null;
}

export interface BudgetParams {
  month?: number;
  year?: number;
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

export const budgetsApi = {
  getAll: async (params?: BudgetParams): Promise<Budget[]> => {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.set('month', params.month.toString());
    if (params?.year) searchParams.set('year', params.year.toString());

    const query = searchParams.toString();
    return fetchAPI<Budget[]>(`/budgets${query ? `?${query}` : ''}`);
  },

  create: async (data: { categoryId?: string; month: number; year: number; amount: number }): Promise<Budget> => {
    return fetchAPI<Budget>('/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<{ categoryId?: string; month: number; year: number; amount: number }>): Promise<Budget> => {
    return fetchAPI<Budget>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/budgets/${id}`, {
      method: 'DELETE',
    });
  },
};