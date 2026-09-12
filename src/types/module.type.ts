import { Account } from "./account.type";

export type ProjectModuleStatus = "REVISION" | "RECHAZADO" | "ACEPTADO";

export type Module = {
    id: number,
    name: string,
    status: ProjectModuleStatus 
}

export type PreevaluationStatus = "PRESENTE" | "AUSENTE";

export type Preevaluation = {
    id: number,
    progress: string,
    status: PreevaluationStatus, 
    evaluator: Account,
}

export type ProjectModulePreevaluations = {
    module: Module,
    preevaluations: Preevaluation[]
}