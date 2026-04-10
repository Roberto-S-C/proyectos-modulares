import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";
import { AuthState, AuthStateUser, DecodedIdToken, TokensKeys, TokensResponse } from "../types/auth.types";

const COGNITO_CONFIG = {
    REGION: 'us-east-2',
    USER_POOL_ID: 'us-east-2KgY5zcihq',
    CLIENT_ID: '4u38bkae94s1kqorlc9afib0nr',
    REDIRECT_URI: 'proyectosmodulares://login',
    SCOPES: ['openid email phone profile']
}

const discovery = {
    authorizationEndpoint: `https://${COGNITO_CONFIG.USER_POOL_ID}.auth.${COGNITO_CONFIG.REGION}.amazoncognito.com/oauth2/authorize`,
    tokenEndpoint: `https://${COGNITO_CONFIG.USER_POOL_ID}.auth.${COGNITO_CONFIG.REGION}.amazoncognito.com/oauth2/token`
}

export const useGetAuthCode = () => {
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: COGNITO_CONFIG.CLIENT_ID,
            responseType: 'code',
            scopes: COGNITO_CONFIG.SCOPES,
            redirectUri: makeRedirectUri({
                scheme: 'proyectosmodulares',
                path: 'login'
            })
        },
        discovery
    );

    return { request, response, promptAsync };
};

export const exchangeCodeForTokens = async (code: string, code_verifier: string): Promise<TokensResponse | undefined> => {
    const tokenEndpoint = `https://${COGNITO_CONFIG.USER_POOL_ID}.auth.${COGNITO_CONFIG.REGION}.amazoncognito.com/oauth2/token`

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: COGNITO_CONFIG.CLIENT_ID,
        code,
        code_verifier,
        redirect_uri: 'proyectosmodulares://login',
    }).toString();

    let tokens: TokensResponse;
    try {
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body,
        });
        tokens = await response.json();

    } catch (e) {
        return undefined;
    }
    return tokens;
}

export const storeTokens = async (tokens: TokensResponse) => {
    const { access_token, id_token, refresh_token } = tokens;
    await SecureStore.setItemAsync(TokensKeys.access, access_token);
    await SecureStore.setItemAsync(TokensKeys.id, id_token);
    await SecureStore.setItemAsync(TokensKeys.refresh, refresh_token);
}


export const retrieveTokens = async () => {
    const access_token = await SecureStore.getItemAsync(TokensKeys.access);
    const id_token = await SecureStore.getItemAsync(TokensKeys.id);
    const refresh_token = await SecureStore.getItemAsync(TokensKeys.refresh);

    return { access_token, id_token, refresh_token }
}

export const removeTokens = async () => {
    await SecureStore.deleteItemAsync(TokensKeys.access);
    await SecureStore.deleteItemAsync(TokensKeys.id);
    await SecureStore.deleteItemAsync(TokensKeys.refresh);
}

export const decodeIdToken = (id_token: string): DecodedIdToken => {
    return jwtDecode(id_token);
}

export const isAuthStateValid = (authState: AuthState | null) => {
    if (authState && authState.tokens && authState.tokens.access_token && authState.tokens.id_token && authState.tokens.refresh_token && authState.user && authState.user.id && authState.user.roles && authState.user.roles.length > 0) {
        return true;
    }
    return false;
}

export const initAuthState = async (): Promise<AuthState> => {

    let user: AuthStateUser = {
        "id": null,
        "roles": []
    }

    let authState: AuthState = {
        tokens: {
            access_token: null,
            id_token: null,
            refresh_token: null
        },
        user: user
    }

    let tokens = await retrieveTokens();
    if (tokens && tokens.access_token && tokens.id_token && tokens.refresh_token) {
        authState.tokens = tokens;
        let decodedToken = decodeIdToken(tokens.id_token);
        user.id = decodedToken.sub;
        user.roles = decodedToken["cognito:groups"];
    }

    return authState;
}