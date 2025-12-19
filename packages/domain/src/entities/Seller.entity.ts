export interface Seller {
    id: number;
    name: string | null;
    identification?: string | null;
    observation?: string | null;
}

export interface CreateSellerDto {
    name: string | null;
    identification?: string | null;
    observation?: string | null;
}

export interface UpdateSellerDto {
    name?: string | null;
    identification?: string | null;
    observation?: string | null;
}