import axios from 'axios';
import { getAuthToken, getAuthTokenAsync, clearAuthToken } from './token-utils';

const API_BASE_URL = window.__env?.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3012/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
// Uses Hrm JWT token (exchanged from Keycloak token)
apiClient.interceptors.request.use(
  async (config) => {
    // Try to get Hrm JWT token (synchronous first, then async if needed)
    let token = getAuthToken();
    
    if (!token) {
      token = await getAuthTokenAsync();
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 (unauthorized)
      clearAuthToken();
      
      // Redirect to Shell login page (don't redirect to /login in microfrontend)
      // Instead, notify parent window or redirect to Shell app
      if (window.parent !== window) {
        // We're in an iframe/embedded context
        window.parent.postMessage({ type: 'AUTH_ERROR', status: 401 }, '*');
      } else {
        // Standalone mode - redirect to Shell login
        const shellUrl = import.meta.env.VITE_SHELL_URL || 'http://localhost:5173';
        window.location.href = `${shellUrl}/login`;
      }
    }
    return Promise.reject(error);
  }
);


