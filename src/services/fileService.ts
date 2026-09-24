import apiClient from "../api/client";
import { MAX_FILE_SIZE, UpdateFileType } from "../types/file.type";

export const isValidFileFormat = (fileMimeType: string | undefined, selectedFileMimeType: string) => {
    if (fileMimeType !== selectedFileMimeType) return false;
    return true;
}
export const isValidFileSize = (size: number | undefined) => {
    if (!size || size <= 0 || size > MAX_FILE_SIZE) return false;
    return true;
}

export const getFileTypes = () => apiClient.get(`/filetypes`);

export const updateFileType = (id: number, fileType: UpdateFileType) => apiClient.patch(`/filetypes/${id}`, fileType);
