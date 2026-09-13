import { Account } from "./account.type"
import { FileType } from "./file.type"
import { Module } from "./module.type"

export type Project = {
    id: number,
    name: string,
    status: string,
    description: string,
    presentationDate: string,
    coverImageUrl: string
}

export type ProjectMembers = {
    id: number,
    name: string,
    advisor: Account,
    members: Account[],
    coverImageUrl: string
}

export type CreateProject = {
    name: string,
    description: string,
    status: string,
    presentationDate: string,
    advisorId: string,
    modules: string[]
}

export type UpdateProject = {
    name?: string,
    description?: string,
    status?: string,
    presentationDate?: string,
    advisorId?: string
}

export type AddProjectMember = {
    memberId: string
}

export type ProjectFileStatus =
    "FALTANTE" |
    "CARGANDO" |
    "FALLIDO" |
    "REVISION" |
    "APROVADO" |
    "RECHAZADO";

export type ProjectFile = {
    id: number,
    link: string,
    status: ProjectFileStatus,
    uploadedAt: Date,
    fileType: FileType
}

export type ProjectFiles = {
    projectId: number,
    projectName: string,
    files: ProjectFile[]
}

export type ProjectStatus =
    "APROVADO" |
    "RECHAZADO" |
    "REVISION";

export type ProjectModules = {
    id: number,
    name: string,
    modules: Module[],
    projectStatus: ProjectStatus,
    coverImageUrl: string
}