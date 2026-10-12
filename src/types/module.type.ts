import { Account } from "./account.type";

export type ProjectModuleStatus = "REVISION" | "APROVADO" | "NA" | "NP";

export type AdminModule = {
    id: number,
    name: string
}

export type CreateModule = {
    name: string,
    questions: string[]
}

export type AdminModuleQuestions = {
    id: number,
    name: string,
    questions: { id: number, name: string }[]
}

export type Module = {
    id: number,
    name: string,
    status: ProjectModuleStatus
}

export type AddProjectModule = {
    projectModuleId: number
}

export type PreevaluationStatus = "PRESENTE" | "NP";

export type Preevaluation = {
    id: number,
    progress: string | null,
    status: PreevaluationStatus,
    evaluator: Account,
}

export type ProjectModulePreevaluations = {
    module: Module,
    preevaluations: Preevaluation[]
}

export type PreevaluationScores =
    "-50%" |
    "60%" |
    "70%" |
    "80%" |
    "90%" |
    "100%";

export type CreateModulePreevaluation = {
    projectModuleId: number,
    status: PreevaluationStatus,
    progress?: PreevaluationScores,
}

export type PreevaluationComment = {
    id: number,
    comment: string,
    createdAt: string,
    username: string,
    presentationSemester: string,
}

export type CreatePreevaluationComment = {
    comment: string,
}

export type ProjectModuleScore = {
    projectId: number,
    projectModuleId: number,
    moduleName: string,
    score: number | null,
}

export type Evaluation = {
    userId: string,
    userName: string,
    score: number,
}

export type ProjectModuleEvaluations = {
    projectId: number,
    projectModuleId: number,
    moduleName: string,
    evaluations: Evaluation[],
}

export type ProjectEvaluations = {
    projectName: string,
    coverImageUrl: string,
    score: number | null,
    moduleScores: ProjectModuleScore[],
    evaluatorIds: string[],
}

export type ModuleQuestionItem = {
    id: number,
    name: string,
}

export type ProjectModuleQuestions = {
    projectModuleId: number,
    moduleName: string,
    questions: ModuleQuestionItem[],
}

export type CreateModuleEvaluation = {
    projectModuleId: number,
    moduleQuestionId: number,
    score: number,
}