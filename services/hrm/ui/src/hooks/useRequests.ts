// services/hrm/ui/src/hooks/useRequests.ts

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../utils/api-client';
import { Request, PaginatedResponse, ApiError } from '../types';

export interface UseRequestsOptions {
  type?: string;
  status?: string;
  autoFetch?: boolean;
}

export const useRequests = (options: UseRequestsOptions = {}) => {
  const { type, status, autoFetch = true } = options;
  
  const [data, setData] = useState<PaginatedResponse<Request> | null>(null);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (status) params.append('status', status);
      
      const response = await apiClient.get<PaginatedResponse<Request>>(`/requests?${params.toString()}`);
      setData(response.data);
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch requests',
        statusCode: err.response?.status,
        details: err.response?.data
      });
    } finally {
      setIsLoading(false);
    }
  }, [type, status]);

  useEffect(() => {
    if (autoFetch) {
      fetchRequests();
    }
  }, [fetchRequests, autoFetch]);

  const createRequest = useCallback(async (requestData: Partial<Request>) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post<Request>('/requests', requestData);
      await fetchRequests(); // Refresh list
      return response.data;
    } catch (err: any) {
      const apiError = {
        message: err.response?.data?.message || 'Failed to create request',
        statusCode: err.response?.status,
        details: err.response?.data
      };
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [fetchRequests]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchRequests,
    createRequest
  };
};
