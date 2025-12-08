import { Client, OrganizationType } from "@/domain/entities/Client.entity";

export const getFullName = (client: Client): string => {
    if (client.organizationType === OrganizationType.PERSON_JURIDIC && client.commercialName) {
        return client.commercialName;
    }

    let name = client.firstName || '';
    if (client.otherNames) name += ` ${client.otherNames}`;
    if (client.firstLastName) name += ` ${client.firstLastName}`;
    if (client.secondLastName) name += ` ${client.secondLastName}`;

    return name.trim() || client.commercialName || 'Sin nombre';
};