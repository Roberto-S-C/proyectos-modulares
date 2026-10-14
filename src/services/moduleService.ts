import apiClient from "../api/client";
import { CreateModule, SaveModuleQuestion } from "../types/module.type";

export const getModules = () => apiClient.get(`/modules`);

export const getModuleQuestions = (id: number) => apiClient.get(`/modules/${id}/questions`);

export const createModule = (module: CreateModule) => apiClient.post(`/modules`, module);

export const deleteModule = (id: number) => apiClient.delete(`/modules/${id}`);

export const addModuleQuestion = (moduleId: number, question: SaveModuleQuestion) => apiClient.post(`/modules/${moduleId}/questions`, question);

export const updateModuleQuestion = (moduleId: number, questionId: number, question: SaveModuleQuestion) => apiClient.patch(`/modules/${moduleId}/questions/${questionId}`, question);

export const deleteModuleQuestion = (moduleId: number, questionId: number) => apiClient.delete(`/modules/${moduleId}/questions/${questionId}`);
