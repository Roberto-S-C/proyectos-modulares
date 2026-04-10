import React, { createContext, ReactNode, useEffect, useState } from 'react';
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
    initAuthState().then(res => setAuthState(res));
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