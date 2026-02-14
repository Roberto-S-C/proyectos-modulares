import {
  AuthState,
  AuthTokens,
  exchangeAuthorizationCodeForTokens,
  getUserFromToken,
  initiateAuth,
  refreshAccessToken
} from '@/src/lib/auth';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKENS: 'auth_tokens',
  CODE_VERIFIER: 'auth_code_verifier',
  REDIRECT_URI: 'auth_redirect_uri',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    tokens: null,
    user: null,
    isLoading: true,
    error: null,
  });

  let router = useRouter();
  
  // Load tokens from storage on mount only
  useEffect(() => {
    loadStoredTokens();
  }, []);

  // Handle navigation based on authentication state
  useEffect(() => {
    if (!state.isLoading) {
      if (!state.isAuthenticated) {
        router.replace('/login');
      }
    }

    console.log(state.user);
  }, [state.isAuthenticated, state.isLoading, router]);

  const loadStoredTokens = async () => {
    try {
      const storedTokens = await SecureStore.getItemAsync(STORAGE_KEYS.TOKENS);
      if (storedTokens) {
        const tokens: AuthTokens = JSON.parse(storedTokens);

        // Check if tokens are expired
        if (isTokenExpired(tokens)) {
          // Try to refresh if we have a refresh token
          if (tokens.refreshToken) {
            await refreshTokens();
          } else {
            await clearAuth();
          }
        } else {
          const user = getUserFromToken(tokens.idToken);
          setState({
            isAuthenticated: true,
            tokens,
            user,
            isLoading: false,
            error: null,
          });
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading stored tokens:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load authentication state',
      }));
    }
  };

  const isTokenExpired = (tokens: AuthTokens): boolean => {
    try {
      const decoded = JSON.parse(atob(tokens.idToken.split('.')[1]));
      const exp = decoded.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch {
      return true;
    }
  };

  const saveTokens = async (tokens: AuthTokens) => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
      console.log(JSON.stringify(tokens));
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  };

  const clearAuth = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKENS);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.CODE_VERIFIER);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REDIRECT_URI);
      setState({
        isAuthenticated: false,
        tokens: null,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  };

  const login = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { code, redirectUri } = await initiateAuth();
      console.log('-------------------------------------')
      console.log(redirectUri);
      console.log(code);
      console.log('-------------------------------------')

      //Exchange Authorization Code for Tokens
      const tokens = await exchangeAuthorizationCodeForTokens(code, redirectUri);
      const user = getUserFromToken(tokens.idToken);

      await saveTokens(tokens);

      setState({
        isAuthenticated: true,
        tokens,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
      }));
    }
  };

  const refreshTokens = async () => {
    try {
      const storedTokens = await SecureStore.getItemAsync(STORAGE_KEYS.TOKENS);
      if (!storedTokens) {
        throw new Error('No tokens to refresh');
      }

      const tokens: AuthTokens = JSON.parse(storedTokens);
      if (!tokens.refreshToken) {
        throw new Error('No refresh token available');
      }

      const newTokens = await refreshAccessToken(tokens.refreshToken);
      const user = getUserFromToken(newTokens.idToken);

      await saveTokens(newTokens);

      setState({
        isAuthenticated: true,
        tokens: newTokens,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Token refresh error:', error);
      await clearAuth();
      setState((prev) => ({
        ...prev,
        error: error.message || 'Failed to refresh tokens',
      }));
    }
  };

  const logout = async () => {
    console.log("Logout........")
    await clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshTokens,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

