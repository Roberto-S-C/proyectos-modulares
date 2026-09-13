import { ProjectStatus } from "@/src/types/project.types";

export const PROJECT_STATUS_VARIANT: Record<ProjectStatus, "error" | "success" | undefined> = {
    APROVADO: "success",
    RECHAZADO: "error",
    REVISION: undefined,
}
