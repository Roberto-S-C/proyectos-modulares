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