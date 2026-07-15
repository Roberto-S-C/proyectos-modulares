import apiClient from "../api/client";
import { CreateProject } from "../types/project.types";

export const getProjects = () => apiClient.get('/projects');


export const getProject = (id: number) => apiClient.get(`/projects/${id}`);

export const getProjectMembers = (id: number) => apiClient.get(`/projects/${id}/members`);

export const createProject =  (project: CreateProject) => apiClient.post(`/projects`, project);