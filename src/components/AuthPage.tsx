"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/authContext"
import type { LoginCredentials, RegisterCredentials } from "../types/auth"

type AuthMode = 'login' | 'register'

export default function AuthPage() {
    const { login, register } = useAuth()
    const router = useRouter()
    const [mode, setMode] = useState<AuthMode>('login')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)
        try {
            if (mode === "login") {
                const credentials: LoginCredentials = { email: formData.email, password: formData.password }
                await login(credentials)
            } else {
                const credentials: RegisterCredentials = formData
                await register(credentials)
            }
            router.push("/events")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocurrio un error, verifica tus datos")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>{mode === "login" ? "Iniciar sesion" : "Crear cuenta"}</h2>

                <form onSubmit={handleSubmit}>
                    {mode === "register" && (
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej. Juan Rangel"
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Ej. juan.r@gmail.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contrasena</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="*********"
                            required
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? "Cargando..." : mode === "login" ? "Entrar" : "Registrarse"}
                    </button>
                </form>

                <button className="btn-link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null) }}>
                    {mode === "login" ? "No tengo cuenta, registrarme" : "Ya tengo cuenta, iniciar sesion"}
                </button>
            </div>
        </div>
    )
}