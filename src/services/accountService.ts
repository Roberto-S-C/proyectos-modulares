import apiClient from "../api/client";


export const searchAccounts = (email: string, role: string) => apiClient.get(`/accounts?email=${email}&role=${role}`);

export const getAccountDetails = (id: string) => apiClient.get(`/accounts/${id}`);

export const getAvailableMembers = () => apiClient.get(`/accounts/available-members`);

export const getAvailableAdvisors = (presentationSemester: string) => apiClient.get(`/accounts/available-advisors?presentationSemester=${presentationSemester}`);