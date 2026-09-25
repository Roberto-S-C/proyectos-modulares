import apiClient from "../api/client";
import { CreateModule } from "../types/module.type";

export const getModules = () => apiClient.get(`/modules`);

export const getModuleQuestions = (id: number) => apiClient.get(`/modules/${id}/questions`);

export const createModule = (module: CreateModule) => apiClient.post(`/modules`, module);
