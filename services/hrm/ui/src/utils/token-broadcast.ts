/**
 * Token Broadcast Utilities for Hrm UI
 * Listens for token and user information updates from Shell app via BroadcastChannel API
 */

export interface UserInfo {
  id: string | null;
  email: string | null;
  username: string | null;
  organizerId: string | null;
  tenantId: string | null;
  roles: string[];
  permissions: string[];
}

const CHANNEL_NAME = 'veni-ai-auth-channel';
const TOKEN_MESSAGE_TYPE = 'AUTH_TOKEN_UPDATE';
const TOKEN_REQUEST_TYPE = 'AUTH_TOKEN_REQUEST';

export interface TokenMessage {
  type: string;
  token: string | null;
  user: UserInfo | null;
  timestamp: number;
  source: string;
}

export interface AuthUpdate {
  token: string | null;
  user: UserInfo | null;
}

let broadcastChannel: BroadcastChannel | null = null;
let currentToken: string | null = null;
let currentUser: UserInfo | null = null;
let tokenListeners: Set<(update: AuthUpdate) => void> = new Set();

/**
 * Initialize BroadcastChannel listener for token updates
 * Should be called once when app starts
 */
export function initTokenBroadcastListener(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') {
    console.warn('[TokenBroadcast] BroadcastChannel not supported, using fallback methods');
    return null;
  }

  if (broadcastChannel) {
    return broadcastChannel;
  }

  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    
    broadcastChannel.addEventListener('message', (event: MessageEvent<TokenMessage>) => {
      const { type, token, user } = event.data;

      if (type === TOKEN_MESSAGE_TYPE) {
        // Update current token and user info
        currentToken = token;
        currentUser = user || null;
        
        // Store in cookie for persistence
        if (token) {
          setTokenCookie(token);
        } else {
          clearTokenCookie();
        }
        
        // Store user info in localStorage for persistence
        if (user) {
          try {
            localStorage.setItem('user_info', JSON.stringify(user));
          } catch (error) {
            console.error('[TokenBroadcast] Failed to store user info:', error);
          }
        } else {
          localStorage.removeItem('user_info');
        }
        
        // Notify all listeners with both token and user info
        const update: AuthUpdate = {
          token,
          user: user || null,
        };
        tokenListeners.forEach(listener => {
          try {
            listener(update);
          } catch (error) {
            console.error('[TokenBroadcast] Error in token listener:', error);
          }
        });
      } else if (type === TOKEN_REQUEST_TYPE) {
        // Another micro-frontend is requesting the token
        // We can respond if we have it, but typically Shell app will respond
        // This is handled by Shell app, not micro-frontends
      }
    });

    console.debug('[TokenBroadcast] Initialized BroadcastChannel listener');
    return broadcastChannel;
  } catch (error) {
    console.error('[TokenBroadcast] Failed to initialize BroadcastChannel:', error);
    return null;
  }
}

/**
 * Get token from BroadcastChannel (if available)
 */
export function getTokenFromBroadcast(): string | null {
  return currentToken;
}

/**
 * Get user information from BroadcastChannel (if available)
 */
export function getUserFromBroadcast(): UserInfo | null {
  return currentUser;
}

/**
 * Get user information from localStorage (fallback)
 */
export function getUserFromStorage(): UserInfo | null {
  try {
    const userStr = localStorage.getItem('user_info');
    if (userStr) {
      return JSON.parse(userStr) as UserInfo;
    }
  } catch (error) {
    console.error('[TokenBroadcast] Failed to get user from storage:', error);
  }
  return null;
}

/**
 * Subscribe to token and user updates from BroadcastChannel
 * Returns unsubscribe function
 */
export function subscribeToTokenUpdates(
  listener: (update: AuthUpdate) => void
): () => void {
  if (!broadcastChannel) {
    initTokenBroadcastListener();
  }

  tokenListeners.add(listener);

  // Return unsubscribe function
  return () => {
    tokenListeners.delete(listener);
  };
}

/**
 * Close BroadcastChannel listener (cleanup)
 */
export function closeTokenBroadcastListener(): void {
  if (broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
    tokenListeners.clear();
    currentToken = null;
    currentUser = null;
    console.debug('[TokenBroadcast] BroadcastChannel listener closed');
  }
}

/**
 * Check if BroadcastChannel is supported
 */
export function isBroadcastChannelSupported(): boolean {
  return typeof BroadcastChannel !== 'undefined';
}

/**
 * Helper to set token cookie
 */
function setTokenCookie(token: string): void {
  try {
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    const secure = window.location.protocol === 'https:';
    const sameSite = 'Lax';
    
    document.cookie = `auth_token=${token}; Max-Age=${maxAge}; Path=/; SameSite=${sameSite}${secure ? '; Secure' : ''}`;
  } catch (error) {
    console.error('[TokenBroadcast] Failed to set token cookie:', error);
  }
}

/**
 * Helper to clear token cookie
 */
function clearTokenCookie(): void {
  try {
    document.cookie = 'auth_token=; Max-Age=0; Path=/';
  } catch (error) {
    console.error('[TokenBroadcast] Failed to clear token cookie:', error);
  }
}

