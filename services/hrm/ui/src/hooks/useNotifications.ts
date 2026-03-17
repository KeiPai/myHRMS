// services/hrm/ui/src/hooks/useNotifications.ts

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../utils/api-client';
import { Notification, ApiError } from '../types';

export const useNotifications = (autoFetch: boolean = true) => {
  const [data, setData] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<Notification[]>('/notifications');
      setData(response.data);
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch notifications',
        statusCode: err.response?.status,
        details: err.response?.data
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
    }
  }, [fetchNotifications, autoFetch]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
      setData(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to mark notification as read',
        statusCode: err.response?.status,
        details: err.response?.data
      });
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await apiClient.put('/notifications/read-all');
      setData(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to mark all notifications as read',
        statusCode: err.response?.status,
        details: err.response?.data
      });
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};
