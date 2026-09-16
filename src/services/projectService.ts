import apiClient from "../api/client";
import { addFileReview, UploadFile } from "../types/file.type";
import { CreateModuleEvaluation, CreateModulePreevaluation } from "../types/module.type";
import { AddProjectMember, CreateProject, UpdateProject } from "../types/project.types";

export const getProjects = () => apiClient.get('/projects');

export const getProject = (id: number) => apiClient.get(`/projects/${id}`);

export const getProjectMembers = (id: number) => apiClient.get(`/projects/${id}/members`);

export const createProject =  (project: CreateProject) => apiClient.post(`/projects`, project);

export const updateProject = (id: number, project: UpdateProject) => apiClient.patch(`/projects/${id}`, project);

export const addProjectMember = (projectId: number, newMember: AddProjectMember) => apiClient.post(`/projects/${projectId}/members`, newMember);

export const getProjectFiles = (id: number) => apiClient.get(`/projects/${id}/files`);

export const getProjectFileDetails = (projectId: number, fileId: number) => apiClient.get(`projects/${projectId}/files/${fileId}`);

export const getProjectFileReviews = (projectId: number, fileId: number) => apiClient.get(`projects/${projectId}/files/${fileId}/reviews`);

export const addProjectFilewReview = (projectId: number, fileId: number, fileReview: addFileReview) => apiClient.post(`projects/${projectId}/files/${fileId}/reviews`, fileReview);
 
export const getUploadUrl = (id: number, file: UploadFile) => apiClient.post(`projects/${id}/files/upload-url`, file);

export const getFileSignedUrl = (projectId: number, fileId: number) => apiClient.get(`projects/${projectId}/files/${fileId}/signed-url`);

export const getProjectFileStatus = (projectId: number, fileId: number) => apiClient.get(`projects/${projectId}/files/${fileId}/status`);

export const getProjectModules = (projectId: number) => apiClient.get(`projects/${projectId}/modules`);

export const getProjectModulesPreevaluations = (projectId: number) => apiClient.get(`projects/${projectId}/modules/preevaluations`);

export const addProjectModulePreevaluation = (projectId: number, preevaluation: CreateModulePreevaluation) => apiClient.post(`projects/${projectId}/modules/preevaluations`, preevaluation);

export const getProjectEvaluations = (projectId: number) => apiClient.get(`projects/${projectId}/evaluations`);

export const getProjectModuleEvaluations = (projectId: number, projectModuleId: number) => apiClient.get(`projects/${projectId}/modules/${projectModuleId}/evaluations`);

export const getProjectModuleQuestions = (projectId: number) => apiClient.get(`projects/${projectId}/modules/questions`);

export const addProjectEvaluation = (projectId: number, evaluations: CreateModuleEvaluation[]) => apiClient.post(`projects/${projectId}/evaluations`, evaluations);