import apiClient from "../api/client";
import { CreateFileType, IMAGE_MIME_TYPES, MAX_FILE_SIZE, UpdateFileType } from "../types/file.type";

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

export const createFileType = (fileType: CreateFileType) => apiClient.post(`/filetypes`, fileType);

export const updateFileType = (id: number, fileType: UpdateFileType) => apiClient.patch(`/filetypes/${id}`, fileType);
