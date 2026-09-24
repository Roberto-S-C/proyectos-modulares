import apiClient from "../api/client";

export const getModules = () => apiClient.get(`/modules`);

export const getModuleQuestions = (id: number) => apiClient.get(`/modules/${id}/questions`);
