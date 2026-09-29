import { ProjectFileStatus } from "./project.types"

export type FileType = {
    id: number,
    name: string,
    format: string
}

export type CreateFileType = {
    name: string,
    format: string
}

export type UpdateFileType = {
    name: string,
    format: string
}

export type UploadFile = {
    id: number,
    size: number,
    mimeType: string
}

export const FormatTypes = {
    'application/pdf': 'PDF',
    'image/jpeg': 'IMAGEN'
}

// jpg and jpeg files are both reported as image/jpeg by pickers/browsers - there's no separate
// "image/jpg" mime type - so this covers jpg, jpeg and png.
export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10,485,760 bytes

export type FileReviewStatus = 'APROVADO' | 'RECHAZADO';

export type FileReview = {
    id: number,
    review: string,
    status: FileReviewStatus
    createdAt: Date,
    username: String
}

export type addFileReview = {
    review: string,
    status: ProjectFileStatus,
}