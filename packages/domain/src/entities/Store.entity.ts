export interface Store {
    id: number;
    name: string;
    address?: string | null;
    observation?: string | null;
}

export interface CreateStoreDto {
    name: string;
    address?: string | null;
    observation?: string | null;
}

export interface UpdateStoreDto {
    name?: string;
    address?: string | null;
    observation?: string | null;
}