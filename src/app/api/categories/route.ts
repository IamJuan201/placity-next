import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const api = process.env.API_URL

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) { // Si no tiene token
        return NextResponse.json({ statusCode: 401, message: "No autenticado" }, { status: 401 }) 
    }

    const backendResponse = await fetch(`${api}/categories`, {
        headers: { Authorization: `Bearer ${token}` }, // Mandar el token para ver si tiene permisos o no
    })

    const data = await backendResponse.json() // Esa respuesta se guarda en data y luego se retorna el resultado

    return NextResponse.json(data, { status: backendResponse.status })
}

export async function POST(request: Request) {
    const cookieStore = cookies() 
    const token = (await cookieStore).get("accessToken")?.value

    if (!token) {
        return NextResponse.json({statusCode: 401, message: "No autenticado"}, {status: 401})
    }
    
    const body = await request.json()

    const backendResponse = await fetch(`${api}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    })

    const data = await backendResponse.json()

    return NextResponse.json(data, {status: backendResponse.status})
}