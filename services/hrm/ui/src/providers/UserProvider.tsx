/**
 * User Provider for Hrm UI
 * Provides user information shared from Shell app via BroadcastChannel
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  initTokenBroadcastListener,
  subscribeToTokenUpdates,
  getUserFromBroadcast,
  getUserFromStorage,
  isBroadcastChannelSupported,
  type UserInfo,
  type AuthUpdate,
} from '../utils/token-broadcast';

interface UserContextType {
  user: UserInfo | null;
  authenticated: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  authenticated: false,
  hasRole: () => false,
  hasPermission: () => false,
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  // Initialize BroadcastChannel listener
  useEffect(() => {
    if (isBroadcastChannelSupported()) {
      initTokenBroadcastListener();

      // Subscribe to user updates from Shell app
      const unsubscribe = subscribeToTokenUpdates((update: AuthUpdate) => {
        setUser(update.user);
      });

      // Try to get initial user info
      const initialUser = getUserFromBroadcast() || getUserFromStorage();
      if (initialUser) {
        setUser(initialUser);
      }

      return () => {
        unsubscribe();
      };
    } else {
      // Fallback: try to get user from storage
      const storedUser = getUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, []);

  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user || !user.roles) {
        return false;
      }
      return user.roles.includes(role);
    },
    [user]
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user || !user.permissions) {
        return false;
      }
      return user.permissions.includes(permission);
    },
    [user]
  );

  const contextValue: UserContextType = {
    user,
    authenticated: !!user && !!user.id,
    hasRole,
    hasPermission,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

