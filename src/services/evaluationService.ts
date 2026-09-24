import apiClient from "../api/client";

export const getEvaluationDashboard = (presentationSemester: string) =>
    apiClient.get(`/evaluations/dashboard`, { params: { presentationSemester } });
