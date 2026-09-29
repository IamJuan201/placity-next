"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Event } from "@/types/event"
import type { Category } from "@/types/category"
import { deleteEvent, getEvents } from "@/services/eventService"
import { getCategories } from "@/services/categoryService"
import { useAuth } from "@/context/authContext"
import EventFormModal from "@/components/EventFormModal"

export default function EventsPage() {
    const { user, isLoading: isAuthLoading } = useAuth()
    const router = useRouter()
    const [events, setEvents] = useState<Event[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)

    const fetchEvents = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await getEvents()
            setEvents(data)
        } catch {
            setError("No se pudieron cargar los eventos")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthLoading) {
            return
        }
        if (!user) {
            router.push("/login")
            return
        }
        fetchEvents()
        getCategories().then(setCategories).catch(() => {})
    }, [user, isAuthLoading])

    if (isAuthLoading) {
        return <main className="events-page"><p>Cargando...</p></main>
    }

    if (!user) {
        return null
    }

    const handleEdit = (event: Event) => {
        setEditingEvent(event)
        setModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Seguro que quieres eliminar este evento?")) return
        try {
            await deleteEvent(id)
            fetchEvents()
        } catch {
            setError("No se pudo eliminar el evento")
        }
    }

    const handleNew = () => {
        setEditingEvent(null)
        setModalOpen(true)
    }

    return (
        <main className="events-page">
            <div className="events-header">
                <h1>Eventos</h1>
                {user.role === "admin" && (
                    <button className="btn-primary" onClick={handleNew}>
                        Nuevo evento
                    </button>
                )}
            </div>

            {isLoading && <p>Cargando...</p>}
            {error && <p className="error-msg">{error}</p>}

            {!isLoading && events.length === 0 && !error && (
                <div className="empty-state">
                    <p>No hay eventos disponibles. Crea el primero.</p>
                </div>
            )}

            <div className="events-grid">
                {events.map((event) => (
                    <div key={event.id} className="event-card">
                        {event.images && event.images.length > 0 ? (
                            <img src={event.images[0].url} alt={event.name} />
                        ) : (
                            <div className="event-card-placeholder">Sin imagen</div>
                        )}
                        <div className="event-card-body">
                            <h3>{event.name}</h3>
                            {event.description && <p>{event.description}</p>}
                            <p className="event-price">${event.price}</p>
                            <span className="event-badge">
                                {categories.find((cat) => String(cat.id) === String(event.categoryId))?.name ?? "Sin categoria"}
                            </span>
                            <p className="event-meta">Capacidad: {event.capacity}</p>
                            {user.role === "admin" && (
                                <div className="event-card-actions">
                                    <button className="btn-edit" onClick={() => handleEdit(event)}>
                                        Editar
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(event.id)}>
                                        Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <EventFormModal
                    event={editingEvent}
                    onClose={() => setModalOpen(false)}
                    onSaved={fetchEvents}
                />
            )}
        </main>
    )
}