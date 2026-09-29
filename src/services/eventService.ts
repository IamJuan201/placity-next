import { api } from "../lib/axiosConfig";
import type { Event, CreateEvent, UpdateEvent } from "../types/event";
import { getErrorMessage } from "../lib/getErrorMessage";

export async function getEvents(): Promise<Event[]> {
    try {
        const response = await api.get<Event[]>('/events')
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudieron cargar los eventos'), { cause: error })
    }
}

export async function getEventById(id: string): Promise<Event> {
    try {
        const response = await api.get<Event>(`/events/${id}`)
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo obtener el evento'), { cause: error })
    }
}

export async function createEvent(data: CreateEvent): Promise<Event> {
    try {
        const response = await api.post<Event>('/events', data)
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo crear el evento'), { cause: error })
    }
}

export async function updateEvent(data: UpdateEvent, id: string): Promise<Event> {
    try {
        const response = await api.patch<Event>(`/events/${id}`, data)
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo actualizar el evento'), { cause: error })
    }
}

export async function deleteEvent(id: string): Promise<void> {
    try {
        await api.delete(`/events/${id}`)
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo eliminar el evento'), { cause: error })
    }
}