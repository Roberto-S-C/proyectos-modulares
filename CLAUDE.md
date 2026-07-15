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

This is a **React Native (Expo)** app for modular project management in an educational context. Users have one of four roles — `ROLE_ADMIN`, `ROLE_EVALUADOR`, `ROLE_ALUMNO`, `ROLE_USUARIO` — which control which tabs are visible and which home screen is rendered.

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
        [id]/           ← Project detail tabs (description, files, comments, members/, modules/)
      accounts/
      options/
    admin/              ← Admin-only routes
      modules/[id]/
```

Tab visibility is driven by a role → tab name mapping in `src/types/tabLayout.type.ts`. Tabs not in a role's list are hidden via `href: null`.

### Auth System

OAuth2 + PKCE flow against **AWS Cognito**, orchestrated in `src/services/authService.ts`:

1. `useGetAuthCode()` hook triggers browser-based OAuth (`expo-auth-session`)
2. Auth code + PKCE verifier are exchanged for tokens via POST to Cognito token endpoint
3. Tokens (access, id, refresh) are persisted encrypted in `expo-secure-store`
4. `initAuthState()` decodes the id_token (JWT) to extract `user.id` and `cognito:groups` (roles)
5. `AuthContext` holds `{ tokens, user: { id, roles } }` and exposes `isAuthenticated`

The Cognito config (region, user pool ID, client ID, redirect URI) comes entirely from `EXPO_PUBLIC_*` env vars.

**Note:** The Bearer token axios interceptor in `src/api/client.ts` is commented out. API calls currently go unauthenticated unless manually wired.

### API Layer

- **Client:** `src/api/client.ts` — axios instance with `EXPO_PUBLIC_API_URL` as base URL and a 10s timeout. Response interceptor logs errors but does not handle 401/403 or token refresh.
- **Services:** `src/services/` — thin wrappers: `getProjects()`, `getProject(id)`, `getAccountDetails(id)`, etc. Each returns the raw axios promise.
- **Inconsistency:** Some screens call service functions; others call `axios.get(...)` directly with the env var URL. Prefer the service layer pattern.

### State Management

Only **React Context** (`src/contexts/AuthContext.tsx`) is used — no Redux or Zustand. There is no client-side data cache; screens refetch on every visit.

### Roles and Role-Based Rendering

Roles come from the decoded `cognito:groups` claim as an array (e.g. `['ROLE_ALUMNO']`). The home screen (`src/app/(app)/(tabs)/index.tsx`) switches on roles to render one of:

- `AdminHomeScreen`, `EvaluatorHomeScreen`, `StudentHomeScreen`, `UserHomeScreen`

These live in `src/screens/home/`.

### Design System

No third-party UI library. Custom components are in `src/components/`. Color constants are in `src/constants/Colors.js`:
- Primary: `#003566` (dark blue)
- Secondary: `#FFC300` (gold/yellow)

### Environment Variables

All runtime config is in `.env` with the `EXPO_PUBLIC_` prefix (Expo exposes these to the client bundle). Key vars:

```
EXPO_PUBLIC_AWS_REGION
EXPO_PUBLIC_COGNITO_USER_POOL_ID
EXPO_PUBLIC_COGNITO_CLIENT_ID
EXPO_PUBLIC_API_URL                # Local dev IP (e.g. http://192.168.100.6:8080)
```

The deep link scheme `proyectosmodulares://` is registered in `app.json` and is required for the OAuth callback.

### TypeScript

Strict mode is enabled. Path alias `@/*` maps to the repo root. Expo Router typed routes experiment is enabled (`typedRoutes: true` in `app.json`).
