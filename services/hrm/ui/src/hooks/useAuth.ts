// services/hrm/ui/src/hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../providers/UserProvider';
import { getAuthToken, getAuthTokenAsync, clearAuthToken } from '../utils/token-utils';
import { isTokenValid } from '../federation/token-exchange';
import { subscribeToTokenUpdates, type AuthUpdate } from '../utils/token-broadcast';

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const { user, authenticated: userAuthenticated } = useUser();
  const [authState, setAuthState] = useState<AuthState>({
    token: getAuthToken(),
    isAuthenticated: userAuthenticated && !!getAuthToken(),
    isLoading: true,
    error: null,
  });

  const refreshAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const token = await getAuthTokenAsync();
      setAuthState({
        token,
        isAuthenticated: !!token && !!user,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setAuthState({
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Authentication failed',
      });
    }
  }, [user]);

  useEffect(() => {
    // Initial sync
    refreshAuth();

    // Subscribe to updates from Shell
    const unsubscribe = subscribeToTokenUpdates(async (update: AuthUpdate) => {
      if (update.token) {
        // When Shell sends a new token, we might need to re-exchange it
        await refreshAuth();
      } else {
        setAuthState({
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [refreshAuth]);

  // Periodic token validity check — clear auth state if token expires
  useEffect(() => {
    const interval = setInterval(() => {
      setAuthState(prev => {
        if (prev.isAuthenticated && !isTokenValid()) {
          return { token: null, isAuthenticated: false, isLoading: false, error: null };
        }
        return prev;
      });
    }, 60_000); // check every 60 seconds

    return () => clearInterval(interval);
  }, []); // stable — functional updater avoids stale closure

  const logout = useCallback(() => {
    clearAuthToken();
    setAuthState({
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    // In a micro-frontend, we might also want to notify the shell or redirect
    window.location.href = '/';
  }, []);

  return {
    ...authState,
    user,
    logout,
    refreshAuth,
  };
};
