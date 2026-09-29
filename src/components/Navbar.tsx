"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/authContext"

export default function Navbar() {
    const { user, logout } = useAuth()
    const pathname = usePathname()

    if (!user) {
        return null
    }

    return (
        <nav className="navbar">
            <span className="navbar-brand">PlanCity</span>
            <div className="navbar-links">
                <Link href="/events" className={pathname === "/events" ? "nav-link active" : "nav-link"}>
                    Eventos
                </Link>
                <Link href="/categories" className={pathname === "/categories" ? "nav-link active" : "nav-link"}>
                    Categorias
                </Link>
            </div>
            <div className="navbar-user">
                <span className="user-name">{user.name}</span>
                {user.role === "admin" && <span className="badge-admin">Admin</span>}
                <button className="btn-logout" onClick={logout}>Salir</button>
            </div>
        </nav>
    )
}