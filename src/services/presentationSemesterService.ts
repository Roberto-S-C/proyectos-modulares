import apiClient from "../api/client";
import { UpdatePresentationSemester } from "../types/presentationSemester.type";

export const getPresentationSemesters = () => apiClient.get(`/presentation-semesters`);

export const getPresentationSemester = (id: number) => apiClient.get(`/presentation-semesters/${id}`);

export const updatePresentationSemester = (id: number, presentationSemester: UpdatePresentationSemester) =>
    apiClient.patch(`/presentation-semesters/${id}`, presentationSemester);
