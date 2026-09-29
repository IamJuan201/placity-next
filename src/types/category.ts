export interface Category {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategory {
    name: string;
    description?: string;
}

export type UpdateCategory = Partial<CreateCategory>
