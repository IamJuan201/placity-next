import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/context/authContext"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
    title: "PlanCity",
    description: "Eventos y categorias",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                <AuthProvider>
                    <Navbar/>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}