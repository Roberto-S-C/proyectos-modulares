# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android emulator/device
npm run ios            # Run on iOS simulator
npm run web            # Run in browser
npm run lint           # ESLint via expo lint
```

There is no test runner configured — the `src/test/` directory is a stub.

## Architecture Overview

This is a **React Native (Expo)** app for managing modular projects for the University of Guadalajara. Students submit and track projects, evaluators grade them against configurable modules, and advisors/admins manage accounts and project membership — all gated behind AWS Cognito authentication with role-based navigation. Users have one of four roles — `ADMIN`, `EVALUADOR`, `ALUMNO`, `USUARIO` — which control which tabs are visible and which home screen is rendered.

Forms use `react-hook-form` for creation and validation.

### Routing

File-based routing via **Expo Router** under `src/app/`. The root layout wraps everything in `AuthProvider` and uses `Stack.Protected` guards to enforce authentication:

```
src/app/
  _layout.tsx           ← Root: AuthProvider + Stack.Protected guards
  login.tsx             ← Unauthenticated entry point
  splash.tsx
  (app)/
    _layout.tsx         ← Authenticated shell
    (tabs)/
      index.tsx         ← Role-based home (renders role-specific screen component)
      notifications/
      files/
      projects/
        index.tsx, create.tsx
        [id]/           ← Project detail tabs (description, files, comments, modules/, members/)
      accounts/
      options/
    admin/              ← Admin-only routes
      modules/[id]/
```

Tab visibility is driven by a role → tab name mapping in `src/types/tabLayout.type.ts`. Tabs not in a role's list are hidden via `href: null`.

### Auth System

OAuth2 + PKCE flow against **AWS Cognito**, orchestrated in `src/services/authService.ts`:

1. `useGetAuthCode()` hook triggers browser-based OAuth (`expo-auth-session`), using `EXPO_PUBLIC_AUTHORIZATION_ENDPOINT`/`EXPO_PUBLIC_TOKEN_ENDPOINT` as the discovery document directly (not derived from region/user pool ID).
2. Auth code + PKCE verifier are exchanged for tokens via POST to the Cognito token endpoint (`exchangeCodeForTokens`).
3. Tokens (access, id, refresh) are persisted encrypted in `expo-secure-store`.
4. `initAuthState()` decodes the id_token (JWT) to extract `user.id` and the single `role` claim (no longer `cognito:groups`).
5. `AuthContext` holds `{ tokens, user: { id, role } }` and exposes `isAuthenticated`. On mount it also calls `setApiClientAuth()` to hand the access token (and the `setAuthState` setter) to the API client.

`COGNITO_CONFIG` in `authService.ts` only needs `EXPO_PUBLIC_COGNITO_CLIENT_ID` — `EXPO_PUBLIC_AWS_REGION` and `EXPO_PUBLIC_COGNITO_USER_POOL_ID` still exist in `.env` but are currently unused by any code.

Token refresh: on a `401`, the response interceptor in `src/api/client.ts` calls `exchangeRefreshToken()` with the stored refresh token, persists the new tokens, updates `AuthContext` via the setter from `setApiClientAuth()`, and retries the original request. If the refresh itself fails, it clears auth state (forcing a re-login).

### API Layer

- **Client:** `src/api/client.ts` — axios instance with `EXPO_PUBLIC_API_URL` as base URL and a 10s timeout. Request interceptor attaches `Authorization: Bearer <accessToken>` to every call; response interceptor handles 401 → refresh → retry (see above).
- **Services:** `src/services/` — thin wrappers: `authService`, `accountService`, `moduleService`, `projectService`, `s3Service`. Each returns the raw axios promise/response.
- **Inconsistency:** Some screens still call `axios.get(...)` directly with the env var URL instead of going through a service (e.g. parts of `projects/[id]/*.tsx`). Prefer the service layer pattern for new code.

### State Management

Only **React Context** (`src/contexts/AuthContext.tsx`) is used — no Redux or Zustand. There is no client-side data cache; screens refetch on every visit.

### Roles and Role-Based Rendering

The role comes from the decoded id_token's `role` claim as a single string (e.g. `'ALUMNO'`, not an array). The home screen (`src/app/(app)/(tabs)/index.tsx`) switches on `user.role` to render one of:

- `AdminHomeScreen`, `EvaluatorHomeScreen`, `StudentHomeScreen` (`ALUMNO`), `UserHomeScreen` (`USUARIO`)

These live in `src/screens/home/` (per-role account detail views live in `src/screens/AccountDetails/`). Tab visibility per role is defined in `AccountRoleTabsLayout` (`src/types/tabLayout.type.ts`):

| Role        | Home screen           | Tabs                                     |
|-------------|------------------------|-------------------------------------------|
| `ADMIN`     | `AdminHomeScreen`      | Home, Files, Projects, Accounts, Options   |
| `EVALUADOR` | `EvaluatorHomeScreen`  | Home, Notifications, Options               |
| `ALUMNO`    | `StudentHomeScreen`    | Home, Notifications, Options               |
| `USUARIO`   | `UserHomeScreen`       | Home, Projects, Options                    |

### Design System

No third-party UI library. Custom components are in `src/components/`, grouped by feature (`Account/`, `Module/`, `Project/`) plus standalone shared components (`CustomAlert.tsx`, `SemesterPicker.tsx`, `RoundedOptionButton.tsx`, etc.). Color constants are in `src/constants/Colors.js`:
- Primary: `#003566` (dark blue)
- Secondary: `#FFC300` (gold/yellow)

### Environment Variables

All runtime config is in `.env` with the `EXPO_PUBLIC_` prefix (Expo exposes these to the client bundle). Key vars:

```
EXPO_PUBLIC_COGNITO_CLIENT_ID
EXPO_PUBLIC_AUTHORIZATION_ENDPOINT      # Cognito hosted UI /oauth2/authorize URL
EXPO_PUBLIC_TOKEN_ENDPOINT              # Cognito hosted UI /oauth2/token URL
EXPO_PUBLIC_API_URL                     # Local dev IP (e.g. http://192.168.100.6:8080)
EXPO_PUBLIC_CDN_DOMAIN                  # Domain that serves uploaded project images

# Present in .env but currently unused by any code:
EXPO_PUBLIC_AWS_REGION
EXPO_PUBLIC_COGNITO_USER_POOL_ID
```

The deep link scheme `proyectosmodulares://` is registered in `app.json` and is required for the OAuth callback.

### TypeScript

Strict mode is enabled. Path alias `@/*` maps to the repo root. Expo Router typed routes experiment is enabled (`typedRoutes: true` in `app.json`).
