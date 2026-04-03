// Transaction types
export type { Transaction, NewTransaction } from "@/lib/db/schema";
export type { Category, NewCategory } from "@/lib/db/schema";
export type { Budget, NewBudget } from "@/lib/db/schema";
export type { User, NewUser } from "@/lib/db/schema";

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Chart types
export interface ChartData {
  name: string;
  value: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}