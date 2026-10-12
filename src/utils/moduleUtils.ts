const ASPECTOS_GENERALES_MODULE_NAME = "aspectos generales";

// Aspectos Generales is required on every project: added by the backend and never removable
export const isAspectosGenerales = (moduleName: string) =>
    moduleName.trim().toLowerCase() === ASPECTOS_GENERALES_MODULE_NAME;
