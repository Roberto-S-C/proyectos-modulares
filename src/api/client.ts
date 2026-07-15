import axios from 'axios';
import { exchangeRefreshToken, initAuthState, retrieveTokens, storeTokens } from '../services/authService';
import { AuthState } from '../types/auth.types';

const apiClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
});

let accessToken: string = "";
let setAuthContextAuthState: React.Dispatch<React.SetStateAction<AuthState | null>>;

export const setApiClientAuth = (access_token: string, setAuthState: any) => {
    accessToken = access_token;
    setAuthContextAuthState = setAuthState;
}

apiClient.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

apiClient.interceptors.response.use(response => {
    return response;
}, async (error) => {
    let originalRequest = error.config;

    // 401 Unauthenticated
    if (error.response?.status === 401) {
        let { access_token, id_token, refresh_token } = await retrieveTokens();
        if (access_token && id_token && refresh_token) {
            // Get new access_token & id_token 
            let new_tokens = await exchangeRefreshToken(refresh_token);
            if (new_tokens.error) {
                setAuthContextAuthState(null);
                return;
            }

            new_tokens['refresh_token'] = refresh_token;
            await storeTokens(new_tokens);
            let authState = await initAuthState();
            setAuthContextAuthState(authState);

            // Retry original request
            accessToken = new_tokens.access_token;
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

            return apiClient(originalRequest);
        }
    }
});


export default apiClient;