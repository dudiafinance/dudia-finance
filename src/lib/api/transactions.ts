const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string | null;
  amount: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  aiCategorized: boolean;
  aiConfidence: string | null;
  importHash: string | null;
  isRecurring: boolean;
  recurringRuleId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    type: 'income' | 'expense';
  } | null;
}

export interface TransactionParams {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

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

export const transactionsApi = {
  getAll: async (params?: TransactionParams): Promise<Transaction[]> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.type) searchParams.set('type', params.type);
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId);

    const query = searchParams.toString();
    return fetchAPI<Transaction[]>(`/transactions${query ? `?${query}` : ''}`);
  },

  create: async (data: { amount: number; description: string; categoryId?: string; date: string; type: 'income' | 'expense' }): Promise<Transaction> => {
    return fetchAPI<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<{ amount: number; description: string; categoryId?: string; date: string; type: 'income' | 'expense' }>): Promise<Transaction> => {
    return fetchAPI<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};