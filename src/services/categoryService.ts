import { api } from "../lib/axiosConfig"
import { getErrorMessage } from "../lib/getErrorMessage"
import type { Category, CreateCategory, UpdateCategory } from "../types/category"

export async function getCategories(): Promise<Category[]> {
    try {
        const response = await api.get<Category[]>('/categories')
        return response.data
        
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo traer las categorias...'), { cause: error })
    }
}

export async function createCategory(data: CreateCategory): Promise<Category> {
    try {
        const response = await api.post<Category>('/categories', data)
        return response.data
        
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo crear la categoria'), { cause: error })
    }
}

export async function updateCategory(data: UpdateCategory, id: string): Promise<Category> {
    try {
        const response = await api.patch<Category>(`/categories/${id}`, data)
        return response.data
        
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo actualizar la categoria'), { cause: error })
    }
}

export async function deleteCategory(id: string): Promise<void> {
    try {
        await api.delete<Category>(`/categories/${id}`)
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo borrar la categoria'), { cause: error })
    }
}