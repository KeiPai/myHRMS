/**
 * Hrm Service ShellEntry
 *
 * Main entry point when loaded via Module Federation by the Shell app.
 *
 * IMPORTANT:
 * - Do NOT use BrowserRouter (Shell provides routing context)
 * - Handle token exchange from Keycloak token
 * - Listen for auth updates via BroadcastChannel
 */

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';

const LoginPage = React.lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
const EmployeeDirectoryPage = React.lazy(() => import('../pages/EmployeeDirectoryPage').then(m => ({ default: m.EmployeeDirectoryPage })));
const EmployeeProfilePage = React.lazy(() => import('../pages/EmployeeProfilePage').then(m => ({ default: m.EmployeeProfilePage })));
const MyRequestsPage = React.lazy(() => import('../pages/MyRequestsPage').then(m => ({ default: m.MyRequestsPage })));
const NotificationsPage = React.lazy(() => import('../pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ResetPasswordPage = React.lazy(() => import('../pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
import {
  initTokenBroadcastListener,
  subscribeToTokenUpdates,
  isBroadcastChannelSupported,
  getUserFromStorage,
  type AuthUpdate,
} from '../utils/token-broadcast';
import {
  exchangeKeycloakToken,
  getServiceJWT,
  setServiceJWT,
  clearServiceJWT,
  isTokenValid,
  TokenExchangeError,
} from './token-exchange';

const KEYCLOAK_TOKEN_KEY = 'keycloak_token';

function clearKeycloakToken(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(KEYCLOAK_TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
      <p className="text-muted-foreground mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

const HrmAppRemote = () => {
  const [tokenInitialized, setTokenInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const initializeAuth = () => {
      if (!isBroadcastChannelSupported()) {
        setTokenInitialized(true);
        return;
      }

      try {
        initTokenBroadcastListener();

        unsubscribeRef.current = subscribeToTokenUpdates(async (update: AuthUpdate) => {
          if (update.token) {
            try {
              const serviceToken = await exchangeKeycloakToken(update.token);
              if (serviceToken) {
                setServiceJWT(serviceToken);
                setTokenInitialized(true);
                setError(null);
              }
            } catch (err) {
              if (err instanceof TokenExchangeError && err.code === 'UNAUTHENTICATED') {
                clearServiceJWT();
                clearKeycloakToken();
                setError('Unauthenticated. Please sign in again.');
              } else {
                setError(err instanceof Error ? err.message : 'Failed to exchange token');
              }
            }
          } else {
            clearServiceJWT();
            setTokenInitialized(false);
          }
        });

        const existingServiceJwt = getServiceJWT();
        if ((!existingServiceJwt || !isTokenValid()) && typeof localStorage !== 'undefined') {
          const keycloakToken = localStorage.getItem(KEYCLOAK_TOKEN_KEY);
          if (keycloakToken) {
            exchangeKeycloakToken(keycloakToken)
              .then((serviceToken) => {
                if (serviceToken) {
                  setServiceJWT(serviceToken);
                  setTokenInitialized(true);
                  setError(null);
                }
              })
              .catch((err) => {
                if (err instanceof TokenExchangeError && err.code === 'UNAUTHENTICATED') {
                  clearServiceJWT();
                  clearKeycloakToken();
                  setError('Unauthenticated. Please sign in again.');
                } else {
                  setError(err instanceof Error ? err.message : 'Failed to exchange token');
                }
              });
          }
        }
      } catch (err) {
        console.error('[HrmAppRemote] Failed to initialize auth:', err);
        setError('Failed to initialize authentication');
        setTokenInitialized(true);
      }
    };

    initializeAuth();

    const existingToken = getServiceJWT();
    const existingUser = getUserFromStorage();
    if (existingToken && isTokenValid()) {
      setTokenInitialized(true);
    } else if (existingUser) {
      setTokenInitialized(true);
    } else {
      const t = setTimeout(() => {
        setTokenInitialized((prev) => prev || true);
      }, 2000);
      timeoutIdRef.current = t;
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          setError(null);
          setTokenInitialized(false);
          window.location.reload();
        }}
      />
    );
  }

  if (!tokenInitialized) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<Navigate to="/directory" replace />} />
          <Route path="/directory" element={<EmployeeDirectoryPage />} />
          <Route path="/profile/:id" element={<EmployeeProfilePage />} />
          <Route path="/profile" element={<EmployeeDirectoryPage />} />
          <Route path="/requests" element={<MyRequestsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export const meta = {
  displayName: 'Hrm',
  version: '1.0.0',
  description: '',
  routes: {} as Record<string, string>,
};

export { HrmAppRemote };
export default HrmAppRemote;
