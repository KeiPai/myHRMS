// services/hrm/ui/src/hooks/useEmployees.ts

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../utils/api-client';
import { Employee, PaginatedResponse, ApiError } from '../types';

export interface UseEmployeesOptions {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  autoFetch?: boolean;
}

export const useEmployees = (options: UseEmployeesOptions = {}) => {
  const { page = 1, limit = 10, search = '', departmentId = '', autoFetch = true } = options;
  
  const [data, setData] = useState<PaginatedResponse<Employee> | null>(null);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (departmentId) params.append('departmentId', departmentId);
      
      const response = await apiClient.get<PaginatedResponse<Employee>>(`/employees?${params.toString()}`);
      setData(response.data);
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch employees',
        statusCode: err.response?.status,
        details: err.response?.data
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, departmentId]);

  useEffect(() => {
    if (autoFetch) {
      fetchEmployees();
    }
  }, [fetchEmployees, autoFetch]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchEmployees
  };
};
