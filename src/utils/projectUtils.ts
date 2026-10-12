import { ProjectStatus } from "@/src/types/project.types";

export const PROJECT_STATUS_VARIANT: Record<ProjectStatus, "error" | "success" | "warning" | undefined> = {
    APROVADO: "success",
    RECHAZADO: "error",
    REVISION: undefined,
    CONDICIONADO: "warning",
    NP: "error",
    COMPLETADO: undefined,
    ATRASADO: "error",
}
