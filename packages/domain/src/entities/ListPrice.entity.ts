export enum TypePrice {
    VALOR = 'VALOR',
    PORCENTAJE = 'PORCENTAJE'
}

export interface ListPrice {
    id: string;
    name: string;
    type: TypePrice;
    percentage: string;
    description: string | null;
}

export interface CreateListPriceDto {
    name: string;
    type: TypePrice;
    percentage: string;
    description: string | null;
}

export interface UpdateListPriceDto {
    name: string | null;
    type: TypePrice;
    percentage: string;
    description: string | null;
}