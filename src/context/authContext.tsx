"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from "react"
import type { User } from "../types/user"
import type { LoginCredentials, RegisterCredentials } from "../types/auth"
import * as authService from "../services/authService"
import { tokenStorage } from "../lib/tokenStorage"

interface AuthContextValue {
    user: User | null
    role: User["role"] | null
    isLoading: boolean
    login: (credentials: LoginCredentials) => Promise<void>
    register: (credentials: RegisterCredentials) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = tokenStorage.get()

        if (!token) {
            setIsLoading(false)
            return
        }

        authService.getProfile()
            .then((data) => setUser(data))
            .catch(() => tokenStorage.remove())
            .finally(() => setIsLoading(false))
    }, [])

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true)
        try {
            const data = await authService.login(credentials)
            setUser(data.user)
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (credentials: RegisterCredentials) => {
        setIsLoading(true)
        try {
            const data = await authService.register(credentials)
            setUser(data.user)
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        setIsLoading(true)
        try {
            await authService.logout()
        } catch {
            tokenStorage.remove()
        } finally {
            setUser(null)
            setIsLoading(false)
        }
    }

    return (
        <AuthContext.Provider value={{ user, role: user?.role ?? null, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
    return context
}