/**
 * Token Utilities for Hrm UI
 * Handles authentication tokens shared from Shell app
 * Supports BroadcastChannel, URL params, cookies, and localStorage
 */

import {
  initTokenBroadcastListener,
  getTokenFromBroadcast,
  isBroadcastChannelSupported,
} from './token-broadcast';
import {
  exchangeTokenDedupe,
  getServiceJWT,
  clearServiceJWT,
  isTokenValid,
} from '../federation/token-exchange';

function getTokenFromCookie(): string | null {
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth_token') {
        return value || null;
      }
    }
    return null;
  } catch (error) {
    console.error('[getTokenFromCookie] Failed to get token from cookie:', error);
    return null;
  }
}

function getTokenFromUrl(): string | null {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get('token');
  } catch (error) {
    console.error('[getTokenFromUrl] Failed to get token from URL:', error);
    return null;
  }
}

function clearTokenFromUrl(): void {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('token')) {
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url.toString());
    }
  } catch (error) {
    console.error('[clearTokenFromUrl] Failed to clear token from URL:', error);
  }
}

let broadcastInitialized = false;

function ensureBroadcastInitialized(): void {
  if (!broadcastInitialized && isBroadcastChannelSupported()) {
    initTokenBroadcastListener();
    broadcastInitialized = true;
  }
}

export async function getAuthTokenAsync(): Promise<string | null> {
  ensureBroadcastInitialized();

  const storedJWT = getServiceJWT();
  if (storedJWT && isTokenValid()) {
    return storedJWT;
  }

  let keycloakToken: string | null = null;
  if (isBroadcastChannelSupported()) {
    keycloakToken = getTokenFromBroadcast();
  }
  if (!keycloakToken) {
    try {
      keycloakToken = localStorage.getItem('keycloak_token');
    } catch {
      // ignore
    }
  }
  if (!keycloakToken) {
    keycloakToken = getTokenFromUrl() || getTokenFromCookie();
  }

  if (keycloakToken) {
    try {
      const token = await exchangeTokenDedupe(keycloakToken);
      return token ?? null;
    } catch {
      return null;
    }
  }

  return null;
}

export function getAuthToken(): string | null {
  const token = getServiceJWT();
  return token && isTokenValid() ? token : null;
}

export function clearAuthToken(): void {
  try {
    clearServiceJWT();
    document.cookie = 'auth_token=; Max-Age=0; Path=/';
    localStorage.removeItem('token');
    localStorage.removeItem('keycloak_token');
    clearTokenFromUrl();
  } catch {
    // ignore
  }
}
