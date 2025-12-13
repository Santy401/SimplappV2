export interface Store {
    id: string;
    name: string;
    address?: string | null;
    observation?: string | null;
}

export interface CreateStoreDto {
    name: string;
    address?: string | null;
    observation?: string | null;
}