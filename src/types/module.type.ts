export type ProjectModuleStatus = "REVISION" | "RECHAZADO" | "ACEPTADO";

export type Module = {
    id: number,
    name: string,
    status: ProjectModuleStatus 
}