export const TokensKeys = {
    access: 'access_token',
    id: 'id_token',
    refresh: 'refresh_tokens',
}

export type TokensResponse = {
    access_token: string,
    expires_in: number,
    id_token: string,
    refresh_token: string,
    token_type: string
}

export type AuthenticationContext = {
    authState: AuthState | null,
    setAuthState: any,
    isAuthenticated: boolean,
    isLoading: boolean
}

export type Tokens = {
    access_token: string | null,
    id_token: string | null,
    refresh_token: string | null
}

export type Roles = "ADMIN" | "ALUMNO" | "EVALUADOR" | "USUARIO"

export type AuthStateUser = {
    id: string | null,
    role: Roles 
}

export type AuthState = {
    tokens: Tokens,
    user: AuthStateUser
}

export type DecodedIdToken = {
    at_hash: string,
    aud: string,
    auth_time: number,
    role: Roles,
    "cognito:username": string,
    email: string,
    email_verified: boolean,
    exp: number,
    family_name: string,
    given_name: string,
    iat: number,
    identities: [
        {
            dateCreated: string,
            issuer: any,
            primary: string,
            providerName: string,
            providerType: string,
            userId: string
        }
    ],
    iss: string,
    jti: string,
    origin_jti: string,
    picture: string,
    sub: string,
    token_use: string
}