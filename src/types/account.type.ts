import { Project } from "./project.types"

export enum Role {
    Admin = 'ADMIN',
    Evaluador = 'EVALUADOR',
    Asesor = 'ASESOR',
    Alumno = 'ALUMNO',
    Usuario = 'USUARIO',
}

export type Account = {
    id: string,
    name: string,
    lastname: string,
    email: string,
    role: Role
}

export type AccountDetails = {
    id: string,
    name: string,
    lastname: string,
    email: string,
    role: Role,
    profilePicture: string,
    project?: Project | null,
    advisedProjects?: Project[],
    evaluatedProjects?: Project[],
}