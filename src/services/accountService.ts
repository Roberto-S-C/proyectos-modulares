import apiClient from "../api/client";
import { UpdateAccountRole } from "../types/account.type";


export const searchAccounts = (email: string, role: string) => apiClient.get(`/accounts?email=${email}&role=${role}`);

export const getAccountDetails = (id: string) => apiClient.get(`/accounts/${id}`);

export const updateAccountRole = (id: string, role: UpdateAccountRole) => apiClient.patch(`/accounts/${id}/role`, role);

export const getAvailableMembers = () => apiClient.get(`/accounts/available-members`);

export const getAvailableAdvisors = () => apiClient.get(`/accounts/available-advisors`);

export const registerPushToken = (token: string) => apiClient.put(`/accounts/me/push-token`, { token });

export const unregisterPushToken = (token: string) => apiClient.delete(`/accounts/me/push-token`, { data: { token } });