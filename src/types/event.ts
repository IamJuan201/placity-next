export interface EventImage {
    id: string;
    url: string;
    order: number;
    categoryId?: string;
    createdAt?: string;
}

export interface Event {
    id: string;
    name: string;
    description?: string;
    date: string;
    location: string;
    price: number;
    capacity: number;   
    categoryId: number;
    images: EventImage[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateEvent {
    name: string;
    description?: string;
    date: string;
    location: string;
    price: number;
    capacity: number;   
    categoryId: number;
    images?: EventImage[];
}

export type UpdateEvent= Partial<CreateEvent>