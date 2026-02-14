# AWS Cognito PKCE Authentication Setup

This project includes a complete PKCE (Proof Key for Code Exchange) authentication flow using AWS Cognito.

## Features

- ✅ Automatic token refresh
- ✅ Secure token storage using Expo SecureStore
- ✅ User session management
- ✅ Protected routes

## Setup Instructions

### 1. Configure AWS Cognito

1. Create a Cognito User Pool in AWS Console
2. Create an App Client with the following settings:
   - **Allowed OAuth flows**: Authorization code grant
   - **Allowed OAuth scopes**: `openid`, `email`, `phone` `profile`
   - **Allowed callback URLs**: 
     - For production: Your app's deep link URL (`proyectosmodulares://callback`)
   - **Allowed sign-out URLs**: Same as callback URLs

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_AWS_REGION=us-east-2
EXPO_PUBLIC_COGNITO_USER_POOL_ID=us-east-2_XXXXXXXXX
EXPO_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_COGNITO_REDIRECT_URI=proyectosmodulares://callback
```

### 3. Install Dependencies

Key dependencies:
- `expo-auth-session` - OAuth 2.0 authentication
- `expo-secure-store` - Secure token storage
- `expo-web-browser` - Browser authentication

### 4. Update Redirect URI

Make sure the redirect URI in `config/cognito.ts` matches:
- Your Cognito App Client callback URL
- Your app's deep link scheme

## Usage

### Authentication Flow

1. **Login**: User clicks "Sign in with Google" on the login screen
2. **Authorization**: Browser opens with Cognito login page
3. **Callback**: After successful login, user is redirected to `proyectosmodulares://callback`
4. **Token Exchange**: App exchanges authorization code for an authentication token 
5. **Session**: User is authenticated and redirected to home screen

### Using the Auth Hook

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { 
    isAuthenticated, 
    user, 
    tokens, 
    login, 
    logout,
    isLoading 
  } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <LoginScreen />;

  return <AuthenticatedContent user={user} />;
}
```

### Protected Routes

The home screen (`app/(tabs)/index.tsx`) demonstrates protected route logic:

```tsx
if (!isAuthenticated) {
  router.replace('/login');
  return null;
}
```

## File Structure

```
├── config/
│   └── cognito.ts          # Cognito configuration
├── lib/
│   ├── pkce.ts            # PKCE utility functions
│   └── auth.ts            # Authentication service
├── contexts/
│   └── AuthContext.tsx    # Auth context and provider
├── app/
│   ├── login.tsx          # Login screen
│   ├── callback.tsx       # OAuth callback handler
│   └── (tabs)/
│       └── index.tsx      # Protected home screen
```

## Security Features

2. **Secure Storage**: Tokens stored in Expo SecureStore (encrypted)
3. **Token Refresh**: Automatic token refresh before expiration
4. **Code Verifier**: Stored securely and cleared after use

## Troubleshooting

### "No authorization code received"
- Check that callback URL matches Cognito configuration
- Verify redirect URI in `config/cognito.ts`

### "Token exchange failed"
- Verify CLIENT_ID is correct
- Check that PKCE is enabled in Cognito App Client
- Ensure code verifier matches the one used in authorization

### "Authentication cancelled"
- User closed the browser before completing login
- Check network connectivity

## Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)
- [Expo AuthSession Docs](https://docs.expo.dev/versions/latest/sdk/auth-session/)

