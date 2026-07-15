import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { setApiClientAuth } from '../api/client';
import { initAuthState, isAuthStateValid } from '../services/authService';
import { AuthenticationContext, AuthState } from '../types/auth.types';

export const AuthContext = createContext<AuthenticationContext>({
  authState: null, setAuthState: null, isAuthenticated: false, isLoading: true
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initAuthState().then(res => {
      setAuthState(res);
      if (res.tokens.access_token) {
        setApiClientAuth(res.tokens.access_token, setAuthState);
      }
      else {
        setApiClientAuth("", setAuthState);
      }
    });
  }, []);


  useEffect(() => {
    if (isAuthStateValid(authState)) {
      setIsAuthenticated(true);
    }
    else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [authState]);

  return (
    <AuthContext
      value={{ authState, setAuthState, isAuthenticated, isLoading }}>
      {children}
    </AuthContext>
  );
}