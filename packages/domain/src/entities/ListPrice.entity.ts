export enum TypePrice {
    VALOR = 'VALOR',
    PORCENTAJE = 'PORCENTAJE'
}

export interface ListPrice {
    id: number;
    name: string;
    type: TypePrice;
    percentage: number;
    description: string | null;
}

export interface CreateListPriceDto {
    name: string;
    type: TypePrice;
    percentage: number;
    description: string | null;
}

export interface UpdateListPriceDto {
    name: string | null;
    type: TypePrice;
    percentage: number;
    description: string | null;
}