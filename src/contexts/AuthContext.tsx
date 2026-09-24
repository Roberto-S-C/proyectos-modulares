import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react';
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
  const hasResolvedInitialAuthState = useRef(false);

  useEffect(() => {
    initAuthState()
      .then(res => {
        setAuthState(res);
        if (res.tokens.access_token) {
          setApiClientAuth(res.tokens.access_token, setAuthState);
        }
        else {
          setApiClientAuth("", setAuthState);
        }
      })
      .catch(() => {
        // Reading/decoding the stored tokens failed - treat it the same as "no
        // session". authState is already `null` here, so setAuthState(null) below
        // wouldn't trigger a re-render/effect on its own (same value) - resolve
        // isLoading/isAuthenticated directly instead, or the app would be stuck
        // on the splash/loading state forever.
        setApiClientAuth("", setAuthState);
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);


  useEffect(() => {
    // authState is still its initial `null` on the very first render, before
    // initAuthState() (async - reads from SecureStore) has resolved. Evaluating
    // that as "not authenticated" here would flip isLoading to false and briefly
    // show the login screen's sign-in button for every user, even ones with a
    // perfectly valid stored session, right before it flips back. Skip this
    // first pass and let the real result (whenever it arrives) drive isLoading.
    if (!hasResolvedInitialAuthState.current) {
      hasResolvedInitialAuthState.current = true;
      return;
    }

    if (isAuthStateValid(authState)) {
      setIsAuthenticated(true);
    }
    else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [authState]);

  // Keep the API client's in-memory access token in sync on every sign in / sign out / refresh.
  useEffect(() => {
    setApiClientAuth(authState?.tokens?.access_token ?? "", setAuthState);
  }, [authState]);

  return (
    <AuthContext
      value={{ authState, setAuthState, isAuthenticated, isLoading }}>
      {children}
    </AuthContext>
  );
}