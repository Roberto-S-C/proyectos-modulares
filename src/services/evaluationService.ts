import apiClient from "../api/client";

export const getEvaluationDashboard = (presentationSemester: string) =>
    apiClient.get(`/evaluations/dashboard`, { params: { presentationSemester } });

// CSV text, kept as a string so it can be written straight to a file
export const getEvaluationReport = (presentationSemester: string) =>
    apiClient.get<string>(`/evaluations/report`, { params: { presentationSemester }, responseType: 'text' });
