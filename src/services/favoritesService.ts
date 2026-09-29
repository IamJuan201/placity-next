import { api } from "../lib/axiosConfig";
import { getErrorMessage } from "../lib/getErrorMessage";
import type { Event } from "../types/event";

export async function getAllFavorites(): Promise<Event[]> {
    try {
        const response = await api.get<Event[]>('/favorites')
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo obtener los eventos favoritos'), { cause: error })
    }
}

export async function createFavorite(id: string): Promise<Event> {
    try {
        const response = await api.post<Event>(`/favorites/${id}`)
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo añadir el evento favorito'), { cause: error })
    }
}

export async function deleteFavorite(id: string): Promise<void> {
    try {
        await api.delete(`/favorites/${id}`)
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo eliminar el evento favorito'), { cause: error })
    }
}
