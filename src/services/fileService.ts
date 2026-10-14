import apiClient from "../api/client";
import { CreateFileType, CreateTemplateUpload, IMAGE_MIME_TYPES, MAX_FILE_SIZE, UpdateFileType } from "../types/file.type";

export const isValidFileFormat = (fileMimeType: string | undefined, selectedFileMimeType: string) => {
    if (!fileMimeType) return false;
    if (selectedFileMimeType === 'image/jpeg') return IMAGE_MIME_TYPES.includes(fileMimeType);
    return fileMimeType === selectedFileMimeType;
}
export const isValidFileSize = (size: number | undefined) => {
    if (!size || size <= 0 || size > MAX_FILE_SIZE) return false;
    return true;
}

export const getFileTypes = () => apiClient.get(`/filetypes`);

// Templates are stored as "templates/{uuid}-{originalFileName}" - a uuid is always exactly
// 36 characters, so the original name is whatever comes after it and its separating dash.
export const getTemplateFileName = (url: string) => {
    const key = url.slice(url.lastIndexOf('/') + 1);
    return key.slice(37);
}

export const createFileType = (fileType: CreateFileType) => apiClient.post(`/filetypes`, fileType);

export const updateFileType = (id: number, fileType: UpdateFileType) => apiClient.patch(`/filetypes/${id}`, fileType);

export const deleteFileType = (id: number) => apiClient.delete(`/filetypes/${id}`);

export const createTemplateUploadUrl = (id: number, template: CreateTemplateUpload) => apiClient.post(`/filetypes/${id}/template-upload-url`, template);
