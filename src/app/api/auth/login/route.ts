import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const api = process.env.API_URL

// Metodo POST
export async function POST(request: Request) {
    const credentials = await request.json()

    // Hacemos la peticion a la respectiva ruta (segun el swanger)
    const backendResponse = await fetch(`${api}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(credentials),
    })

    // Esa respuesta la guardamos en data siempre usando await xq estamos en una async function
    const data = await backendResponse.json()

    // Si la respuesta no es 200-299 entonces es un error y lo retornamos
    if (!backendResponse.ok) {
        return NextResponse.json(data, { status: backendResponse.status})
    }

    // Aqui se construyen las cookies
    // *Guardan los token de acceso (como JWT) para mantener la sessión del usuario iniciado, preferencias, estados temporales y seguridad.
    const cookieStore = await cookies() // Llama a la api de next para interactuar con el almacenamiento de las cookies del navegador.
    cookieStore.set("accessToken", data.accessToken, { // ---> Aqui se crea la cookie llamada "accessToken" y se le asigna el valor que viene de data.accessToken
        httpOnly: true, // Prevenir ataques XSS, hace la cookie invisible para JS en el navegador.
        secure: process.env.NODE_ENV === "production",  // Define si la cookie se enviara a traves de conexiones HTTPS, esto exige que en el servidor real (produccion) se exija HTTPS de forma obligatoria
        sameSite: "lax", // Protege al user de peticiones en sitios cruzados, el lax hace que el navegador no envie esta cookie si una página web de terceros intenta hacer una peticion a mi servidor. Si lo manda si el user hace clic a un enlace normal a mi web.
        path: "/", // El alacance del sitio web, esto quiere decir /dashboard, /profile, /tienda
        maxAge: 60 * 60 * 24, // El tiempo de vida de la cookie, osea 60 segundos * 60 segundos * 24 segundos, osea --> 86400 segundos -->  1440 minutos --> 1 dia (24horas) 
    })

    return NextResponse.json({user: data.user}) // Manda los datos del usuarios pero inyecta automaticamente las cookies en los headers
}
