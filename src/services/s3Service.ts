import apiClient from "../api/client";

const getPresignedUrl = () => apiClient.post('/storage/presigned-url');