import { api } from "../lib/axiosConfig"
import { getErrorMessage } from "../lib/getErrorMessage"
import { tokenStorage } from "../lib/tokenStorage"
import type { AuthResponse, ChangePassword, LoginCredentials, RegisterCredentials } from "../types/auth"
import type { User } from "../types/user"

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/auth/register', credentials)
        tokenStorage.set(response.data.accessToken)
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo registrar'), { cause: error })
    }
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/auth/login', credentials)
        tokenStorage.set(response.data.accessToken)
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo iniciar sesion'), { cause: error })
    }
}

export const getProfile = async (): Promise<User> => {
    try {
        const response = await api.get<User>('/users/me')
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo obtener el perfil'), { cause: error })
    }
}

export const logout = async () => {
    try {
        const response = await api.post('/auth/logout')
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo cerrar la sesion'), { cause: error })
    } finally {
        tokenStorage.remove()
    }
}

export const updatePassword = async (credentials: ChangePassword) => {
    try {
        const response = await api.patch('/users/me/password', credentials)
        return response
    } catch (error) {
        throw new Error(getErrorMessage(error, 'No se pudo actualizar la contrasena'), { cause: error })
    }
}