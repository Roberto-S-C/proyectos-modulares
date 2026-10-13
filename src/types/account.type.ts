import { Project } from "./project.types"

export enum Role {
    Admin = 'ADMIN',
    Evaluador = 'EVALUADOR',
    Asesor = 'ASESOR',
    Alumno = 'ALUMNO',
    Usuario = 'USUARIO',
}

// Roles an ADMIN can assign (ASESOR isn't a stored role, it comes from the email domain)
export const ASSIGNABLE_ROLES: Role[] = [Role.Usuario, Role.Alumno, Role.Evaluador, Role.Admin];

export type UpdateAccountRole = {
    role: Role
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