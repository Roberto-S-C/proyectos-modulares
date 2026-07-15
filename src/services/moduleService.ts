import apiClient from "../api/client";

export const getModules = () => apiClient.get(`/modules`);