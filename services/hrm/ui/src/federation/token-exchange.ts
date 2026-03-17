/**
 * Token Exchange Utilities for Hrm
 *
 * Exchanges Keycloak token for Hrm JWT via Hrm API.
 * Flow: broadcast → Hrm UI → Hrm API (POST /api/auth/exchange).
 * Uses VITE_API_URL (Hrm API base, e.g. http://localhost:3012/api).
 */

const STORAGE_KEY = 'hrm_service_jwt';

/** Hrm API base URL (e.g. http://localhost:3012/api). When loaded by Shell, must point to Hrm API. */
const API_BASE = (window.__env?.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3012/api').replace(/\/$/, '');

/**
 * Error thrown when token exchange fails so the UI can show Unauthenticated.
 */
export class TokenExchangeError extends Error {
  constructor(
    message: string,
    public readonly code: 'UNAUTHENTICATED' | 'NETWORK' | 'UNKNOWN',
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'TokenExchangeError';
  }
}

/**
 * Exchange Keycloak token for Hrm JWT via Hrm API
 */
export async function exchangeKeycloakToken(keycloakToken: string): Promise<string | null> {
  if (!keycloakToken) {
    return null;
  }

  const url = API_BASE ? `${API_BASE}/auth/exchange` : '/api/auth/exchange';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keycloakToken }),
  });

  const body = await response.json().catch(() => ({ error: 'Unknown error', message: 'Unknown error' }));

  if (!response.ok) {
    const message = (body.message as string) || body.error || 'Token exchange failed';
    if (response.status === 401 && (body.error === 'Unauthenticated' || body.error === 'UNAUTHENTICATED')) {
      throw new TokenExchangeError(message, 'UNAUTHENTICATED', 401);
    }
    if (response.status >= 500 || response.status === 0) {
      throw new TokenExchangeError(message, 'NETWORK', response.status);
    }
    throw new TokenExchangeError(message, 'UNKNOWN', response.status);
  }

  const serviceToken = body.access_token ?? body.accessToken;
  if (!serviceToken) {
    throw new TokenExchangeError('No token in response', 'UNKNOWN');
  }

  setServiceJWT(serviceToken);
  return serviceToken;
}

export function getServiceJWT(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setServiceJWT(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('[TokenExchange] Failed to set token:', error);
  }
}

export function clearServiceJWT(): void {
  setServiceJWT(null);
}

let exchangePromise: Promise<string | null> | null = null;

export async function exchangeTokenDedupe(keycloakToken: string): Promise<string | null> {
  if (exchangePromise) {
    return exchangePromise;
  }

  exchangePromise = exchangeKeycloakToken(keycloakToken).finally(() => {
    exchangePromise = null;
  });

  return exchangePromise;
}

export function isTokenValid(): boolean {
  const token = getServiceJWT();
  if (!token) {
    return false;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);

    return payload.exp > now;
  } catch {
    return false;
  }
}
