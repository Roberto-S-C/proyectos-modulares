import apiClient from "../api/client";
import { addFileReview, UploadFile } from "../types/file.type";
import { AddProjectModule, CreateModuleEvaluation, CreateModulePreevaluation, CreatePreevaluationComment } from "../types/module.type";
import { Page } from "../types/page.types";
import { AddProjectEvaluators, AddProjectMember, CreateProject, Project, UpdateProject, UpdateProjectStatus } from "../types/project.types";

export type ProjectSearchParams = {
    page: number,
    size?: number,
    name?: string,
    semester?: string,
    status?: string,
    sort?: 'asc' | 'desc'
}

// Paginated and filtered on the backend
export const getProjects = (params: ProjectSearchParams) => apiClient.get<Page<Project>>('/projects', { params });

// Every project at once, for pickers that filter on the device
export const getAllProjects = () => apiClient.get<Project[]>('/projects/all');

export const getProject = (id: number) => apiClient.get(`/projects/${id}`);

export const getProjectMembers = (id: number) => apiClient.get(`/projects/${id}/members`);

export const getProjectEvaluators = (id: number) => apiClient.get(`/projects/${id}/evaluators`);

export const addProjectEvaluators = (projectId: number, newEvaluators: AddProjectEvaluators) => apiClient.post(`/projects/${projectId}/evaluators`, newEvaluators);

export const createProject =  (project: CreateProject) => apiClient.post(`/projects`, project);

export const updateProject = (id: number, project: UpdateProject) => apiClient.patch(`/projects/${id}`, project);

export const updateProjectStatus = (id: number, status: UpdateProjectStatus) => apiClient.patch(`/projects/${id}/status`, status);

export const deleteProject = (id: number) => apiClient.delete(`/projects/${id}`);

// The signed-in user (the project's advisor or one of its members) leaves the project
export const leaveProject = (id: number) => apiClient.delete(`/projects/${id}/members/me`);

export const addProjectMember = (projectId: number, newMember: AddProjectMember) => apiClient.post(`/projects/${projectId}/members`, newMember);

export const getProjectFiles = (id: number) => apiClient.get(`/projects/${id}/files`);

export const getProjectFileDetails = (projectId: number, fileId: number) => apiClient.get(`projects/${projectId}/files/${fileId}`);

export const getProjectFileReviews = (projectId: number, fileId: number) => apiClient.get(`projects/${projectId}/files/${fileId}/reviews`);

export const addProjectFilewReview = (projectId: number, fileId: number, fileReview: addFileReview) => apiClient.post(`projects/${projectId}/files/${fileId}/reviews`, fileReview);
 
export const getUploadUrl = (id: number, file: UploadFile) => apiClient.post(`projects/${id}/files/upload-url`, file);

export const getFileSignedUrl = (projectId: number, fileId: number) => apiClient.get(`projects/${projectId}/files/${fileId}/signed-url`);

export const getProjectFileStatus = (projectId: number, fileId: number) => apiClient.get(`projects/${projectId}/files/${fileId}/status`);

export const getProjectModules = (projectId: number) => apiClient.get(`projects/${projectId}/modules`);

export const addProjectModule = (projectId: number, module: AddProjectModule) => apiClient.post(`projects/${projectId}/modules`, module);

export const addAdminProjectModule = (projectId: number, module: AddProjectModule) => apiClient.post(`projects/${projectId}/modules/admin`, module);

export const removeProjectModule = (projectId: number, projectModuleId: number) => apiClient.delete(`projects/${projectId}/modules/${projectModuleId}`);

export const getProjectModulesPreevaluations = (projectId: number) => apiClient.get(`projects/${projectId}/modules/preevaluations`);

export const addProjectModulePreevaluations = (projectId: number, preevaluations: CreateModulePreevaluation[]) => apiClient.post(`projects/${projectId}/modules/preevaluations`, preevaluations);

export const markProjectAbsentFromPreevaluation = (projectId: number) => apiClient.post(`projects/${projectId}/modules/preevaluations/absence`);

export const getPreevaluationComments = (projectId: number) => apiClient.get(`projects/${projectId}/preevaluation-comments`);

export const addPreevaluationComment = (projectId: number, comment: CreatePreevaluationComment) => apiClient.post(`projects/${projectId}/preevaluation-comments`, comment);

export const getProjectEvaluations = (projectId: number) => apiClient.get(`projects/${projectId}/evaluations`);

export const getProjectModuleEvaluations = (projectId: number, projectModuleId: number) => apiClient.get(`projects/${projectId}/modules/${projectModuleId}/evaluations`);

export const getProjectModuleQuestions = (projectId: number) => apiClient.get(`projects/${projectId}/modules/questions`);

export const addProjectEvaluation = (projectId: number, evaluations: CreateModuleEvaluation[]) => apiClient.post(`projects/${projectId}/evaluations`, evaluations);