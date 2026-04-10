import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
});

apiClient.interceptors.request.use(config => {
    // Get tokens
    return config;
})

apiClient.interceptors.response.use(response => response, error => {
    console.log(error);
    console.log(error.status);
})

export default apiClient;