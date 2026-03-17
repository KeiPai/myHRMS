// services/hrm/ui/src/types/common.ts

export interface Department {
  id: string;
  name: string;
  employeeCount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ViewMode = 'grid' | 'list' | 'kanban';

export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
  details?: any;
}
