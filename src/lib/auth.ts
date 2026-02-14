import { COGNITO_CONFIG, getAuthorizationUrl, getTokenUrl } from '@/src/config/cognito';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResponse {
  code: string;
  redirectUri: string;
  state: string;
}

const STORAGE_KEYS = {
  TOKENS: 'auth_tokens',
  CODE_VERIFIER: 'auth_code_verifier',
  REDIRECT_URI: 'auth_redirect_uri',
};

export async function initiateAuth(): Promise<AuthResponse> {
  // Validate configuration
  if (!COGNITO_CONFIG.CLIENT_ID) {
    throw new Error('Cognito CLIENT_ID is not configured');
  }
  if (!COGNITO_CONFIG.USER_POOL_ID) {
    throw new Error('Cognito USER_POOL_ID is not configured');
  }
  if (!COGNITO_CONFIG.REGION) {
    throw new Error('Cognito REGION is not configured');
  }

  // CRITICAL: Always generate redirect URI using AuthSession.makeRedirectUri()
  // This produces a URI with the internal metadata Expo requires for validation.
  // DO NOT use hardcoded URIs like 'proyectosmodulares://callback' - they will fail!
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'proyectosmodulares',
    path: 'callback',
  });

  const authEndpoint = getAuthorizationUrl();
  const params = new URLSearchParams({
    client_id: COGNITO_CONFIG.CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid email phone profile',
  });

  const authUrl = `${authEndpoint}?${params.toString()}`;

  // Open browser for authentication
  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type !== 'success') {
    throw new Error(`Authentication failed: ${result.type}`);
  }

  // Extract code from the redirect URL
  const url = result.url || '';
  const urlParams = new URL(url).searchParams;
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  if (!code) {
    throw new Error('No authorization code received');
  }

  return {
    code,
    redirectUri,
    state: state || '',
  };
}

/**
 * Exchanges authorization code for tokens
 * @param code - Authorization code from Cognito
 * @param redirectUri - The exact redirect URI used in the authorization request
 * @returns Promise that resolves with the tokens
 */
export async function exchangeAuthorizationCodeForTokens(
  code: string,
  redirectUri: string
): Promise<AuthTokens> {
  if (!COGNITO_CONFIG.CLIENT_ID) {
    throw new Error('Cognito CLIENT_ID is not configured');
  }

  const tokenUrl = getTokenUrl();

  // Simple OAuth2 authorization code exchange
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: COGNITO_CONFIG.CLIENT_ID,
    code,
    redirect_uri: redirectUri,
  }).toString();

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Token exchange error response:', errorText);
    console.error('❌ Token exchange status:', response.status);
    throw new Error(`Token exchange failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type || 'Bearer',
  };
}


const isTokenExpired = (tokens: AuthTokens): boolean => {
  try {
    const decoded = JSON.parse(atob(tokens.idToken.split('.')[1]));
    const exp = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch {
    return true;
  }
};

// const loadStoredTokens = async () => {
//   try {
//     const storedTokens = await SecureStore.getItemAsync(STORAGE_KEYS.TOKENS);
//     if (storedTokens) {
//       const tokens: AuthTokens = JSON.parse(storedTokens);

//       // Check if tokens are expired
//       if (isTokenExpired(tokens)) {
//         // Try to refresh if we have a refresh token
//         if (tokens.refreshToken) {
//           await refreshTokens();
//         } else {
//           await clearAuth();
//         }
//       } else {
//         const user = getUserFromToken(tokens.idToken);
//         setState({
//           isAuthenticated: true,
//           tokens,
//           user,
//           isLoading: false,
//           error: null,
//         });
//       }
//     } else {
//       setState((prev) => ({ ...prev, isLoading: false }));
//     }
//   } catch (error) {
//     console.error('Error loading stored tokens:', error);
//     setState((prev) => ({
//       ...prev,
//       isLoading: false,
//       error: 'Failed to load authentication state',
//     }));
//   }
// };

/**
 * Refreshes the access token using a refresh token
 * @param refreshToken - The refresh token
 * @returns Promise that resolves with new tokens
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<AuthTokens> {
  if (!COGNITO_CONFIG.CLIENT_ID) {
    throw new Error('Cognito CLIENT_ID is not configured');
  }

  const tokenUrl = getTokenUrl();

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: COGNITO_CONFIG.CLIENT_ID,
      refresh_token: refreshToken,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    idToken: data.id_token,
    refreshToken: refreshToken, // Refresh token remains the same
    expiresIn: data.expires_in,
    tokenType: data.token_type || 'Bearer',
  };
}

/** * Extracts user information from ID token
 * @param idToken - The ID token
 * @returns User information object
 */
export function getUserFromToken(idToken: string): any {
  const decoded = decodeJWT(idToken);
  if (!decoded) {
    return null;
  }

  return {
    sub: decoded.sub,
    email: decoded.email,
    emailVerified: decoded.email_verified,
    phone: decoded.phone_number,
    phoneVerified: decoded.phone_number_verified,
    name: decoded.name,
    givenName: decoded.given_name,
    familyName: decoded.family_name,
    picture: decoded.picture,
    ...decoded,
  };
}

/**
 * Decodes a JWT token and returns its payload
 * @param token - The JWT token string
 * @returns Decoded payload object or null if decoding fails
 */
function decodeJWT(token: string): any {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');

    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    // Get the payload (second part)
    const payload = parts[1];

    // Decode base64url to base64
    let base64 = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Add padding if necessary
    const padding = 4 - (base64.length % 4);
    if (padding !== 4) {
      base64 += '='.repeat(padding);
    }

    // Decode base64 to string
    const decoded = atob(base64);

    // Parse JSON
    const payload_obj = JSON.parse(decoded);

    return payload_obj;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}