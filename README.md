# Proyectos Modulares

A React Native (Expo) app for managing modular projects for University of Guadalajara. Students submit and track projects, evaluators grade them against configurable modules, advisors/admins manage accounts and project membership — all gated behind AWS Cognito authentication with role-based navigation.

## Tech stack

- [Expo](https://expo.dev) / React Native, [Expo Router](https://docs.expo.dev/router/introduction) (file-based routing)
- TypeScript (strict mode)
- AWS Cognito — OAuth2 + PKCE via `expo-auth-session`, tokens persisted in `expo-secure-store`
- Axios for API calls
- React Context for state
- `react-hook-form` for forms creation and validations

## Getting started

### Prerequisites

- Node.js and npm
- An Expo account / the Expo CLI (installed automatically via `npx`)
- A running instance of the backend API this app talks to, and an AWS Cognito user pool configured for OAuth2 + PKCE

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (values are exposed to the client bundle via the `EXPO_PUBLIC_` prefix):

```bash
EXPO_PUBLIC_AWS_REGION=
EXPO_PUBLIC_COGNITO_USER_POOL_ID=
EXPO_PUBLIC_COGNITO_CLIENT_ID=
EXPO_PUBLIC_AUTHORIZATION_ENDPOINT=      # Cognito hosted UI /oauth2/authorize URL
EXPO_PUBLIC_TOKEN_ENDPOINT=              # Cognito hosted UI /oauth2/token URL
EXPO_PUBLIC_API_URL=                     # Backend API base URL
EXPO_PUBLIC_CDN_DOMAIN=                  # Domain that serves media files
```

The OAuth redirect URI is the app's deep link scheme, `proyectosmodulares://login`, registered in `app.json`.

### 3. Run the app

```bash
npx expo # Expo dev server
npx expo run:android # Run on an Android emulator/device
```

### Other scripts

```bash
npm run lint        # ESLint via `expo lint`
```

There is no test runner configured yet (`src/test/` is a stub).

## Roles

Each account has a single role (from the decoded Cognito `id_token`'s `role` claim), which determines the visible tabs and the home screen rendered:

| Role       | Home screen           | Tabs                                        |
|------------|------------------------|----------------------------------------------|
| `ADMIN`    | `AdminHomeScreen`      | Home, Files, Projects, Accounts, Options      |
| `EVALUADOR`| `EvaluatorHomeScreen`  | Home, Notifications, Options                  |
| `ALUMNO`   | `StudentHomeScreen`    | Home, Notifications, Options                  |
| `USUARIO`  | `UserHomeScreen`       | Home, Projects, Options                       |

The role → tab mapping lives in `src/types/tabLayout.type.ts`; tabs outside a role's list are hidden (`href: null`) in `src/app/(app)/(tabs)/_layout.tsx`.

## Project structure

```
src/
  app/                        # Expo Router file-based routes
    _layout.tsx                # Root: AuthProvider + auth guards
    login.tsx / splash.tsx
    (app)/
      _layout.tsx               # Authenticated shell
      (tabs)/
        index.tsx                 # Role-based home
        projects/
          index.tsx, create.tsx
          [id]/                    # description, files, comments, modules/, members/
        accounts/                # Admin: manage accounts
        notifications/
        files/
        options/
      admin/
        modules/[id]/            # Admin: evaluation module editor
  components/                  # Grouped by feature: Account/, Module/, Project/, plus shared UI
  screens/
    home/                       # One screen per role
    AccountDetails/              # One screen per role's account detail view
  services/                    # Thin axios wrappers: authService, accountService,
                                # moduleService, projectService, s3Service
  contexts/AuthContext.tsx     # Holds { tokens, user: { id, role } }
  api/client.ts                # Axios instance, bearer token + refresh-token interceptor
  types/                       # auth, account, module, project, tabLayout
  constants/Colors.js
```

## Authentication flow

OAuth2 + PKCE against AWS Cognito, implemented in `src/services/authService.ts`:

1. `useGetAuthCode()` opens the Cognito hosted UI in-browser via `expo-auth-session`.
2. The returned auth code + PKCE verifier are exchanged for tokens by POSTing to the Cognito token endpoint.
3. Access, ID, and refresh tokens are persisted encrypted via `expo-secure-store`.
4. `initAuthState()` decodes the ID token (JWT) to populate `user.id` and `user.role`.
5. `AuthContext` exposes `{ tokens, user }` and `isAuthenticated` to the rest of the app.
6. `src/api/client.ts` attaches the access token to every request; on a `401` it exchanges the stored refresh token for a new token pair, updates `AuthContext`, and retries the original request.

## Design system

No third-party UI kit — all components are custom, under `src/components/`. Brand colors are defined in `src/constants/Colors.js`:

- Primary: `#003566` (dark blue)
- Secondary: `#FFC300` (gold/yellow)

## TypeScript

Strict mode is enabled. The `@/*` path alias maps to the repo root, and Expo Router's typed routes experiment is enabled (`typedRoutes: true` in `app.json`).

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction)
