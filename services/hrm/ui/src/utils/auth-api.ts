/**
 * Auth API Client
 * Calls HRM API auth endpoints for login and password reset.
 * Falls back gracefully when the API is unavailable (dev mode).
 */

let _apiBase: string | null = null;
function getApiBase(): string {
  if (!_apiBase) {
    _apiBase = (
      (typeof window !== 'undefined' && window.__env?.VITE_API_URL) ||
      import.meta.env.VITE_API_URL ||
      'http://localhost:3012/api'
    ).replace(/\/$/, '');
  }
  return _apiBase;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export class ApiUnavailableError extends Error {
  constructor(message: string = 'Auth API unavailable') {
    super(message);
    this.name = 'ApiUnavailableError';
  }
}

/**
 * Shared POST helper — handles 404 detection, JSON parsing, and error extraction.
 */
async function postApi<T>(
  endpoint: string,
  payload: Record<string, unknown>,
  errorFallback: string,
): Promise<T> {
  const res = await fetch(`${getApiBase()}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (res.status === 404) {
    throw new ApiUnavailableError(`${endpoint} not deployed`);
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message = body?.error?.message || body?.message || errorFallback;
    throw new Error(message);
  }

  return body;
}

/**
 * Login with email and password via HRM API.
 */
export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const body = await postApi<LoginResponse | null>(
    '/auth/login',
    { email, password },
    'Invalid email or password',
  );

  if (!body) {
    throw new ApiUnavailableError('Invalid response from server');
  }

  return body;
}

/**
 * Request password reset (forgot password) via HRM API.
 */
export async function requestPasswordResetApi(email: string): Promise<{ success: boolean }> {
  const body = await postApi<{ success: boolean } | null>(
    '/auth/request-password-reset',
    { email },
    'Failed to request password reset',
  );
  return body ?? { success: true };
}

/**
 * Confirm password reset with token via HRM API.
 */
export async function confirmPasswordResetApi(
  token: string,
  newPassword: string,
): Promise<{ success: boolean }> {
  const body = await postApi<{ success: boolean } | null>(
    '/auth/confirm-password-reset',
    { token, newPassword },
    'Failed to reset password',
  );
  return body ?? { success: true };
}
