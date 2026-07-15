export enum Role {
    Admin = 'ROLE_ADMIN',
    Evaluador = 'ROLE_EVALUADOR',
    Asesor = 'ROLE_ASESOR',
    Alumno = 'ROLE_ALUMNO',
    Usuario = 'ROLE_USUARIO',
}

export type Account = {
    id: string,
    name: string,
    lastname: string,
    email: string,
    role: Role
}