import { IdentificationType } from "@/domain/entities/Client.entity";

export const formatIdentificationType = (type: IdentificationType): string => {
    const typeMap: Record<IdentificationType, string> = {
        [IdentificationType.CITIZEN_ID]: "C.C.",
        [IdentificationType.NIT]: "NIT",
        [IdentificationType.PASSPORT]: "Pasaporte",
        [IdentificationType.TAX_ID]: "C.E.",
        [IdentificationType.FOREIGN_ID]: "ID Ext."
    };
    return typeMap[type] || type;
};