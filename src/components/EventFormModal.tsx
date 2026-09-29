"use client"

import { useEffect, useState } from "react";
import type { Event, CreateEvent } from "../types/event";
import type { Category } from "../types/category";
import { getCategories } from "../services/categoryService";
import { createEvent, updateEvent } from "../services/eventService";

interface EventFormModalProps {
    event?: Event | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function EventFormModal({ event, onClose, onSaved }: EventFormModalProps) {
    const isEditing = !!event
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: event?.name ?? "",
        description: event?.description ?? "",
        date: event?.date ?? "",
        location: event?.location ?? "",
        price: event?.price ?? 0,
        capacity: event?.capacity ?? 0,
        categoryId: event?.categoryId ? String(event.categoryId) : "",
    })

    useEffect(() => {
        getCategories().then(setCategories).catch(() => setError("No se pudieron cargar las categorias"))
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: name === "price" || name === "capacity" ? Number(value) : value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)
        try {
            const data: CreateEvent = {...formData,
                categoryId: Number(formData.categoryId)
            }
            if (isEditing) {
                await updateEvent(data, event.id)
            } else {
                await createEvent(data)
            }
            onSaved()
            onClose()
        } catch {
            setError("No se pudo guardar el evento")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditing ? "Editar evento" : "Nuevo evento"}</h2>
                    <button className="modal-close" onClick={onClose}>x</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre </label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Descripcion </label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
                    </div>

                    <div className="form-group">
                        <label>Fecha </label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Lugar </label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Precio </label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} min={0} step="0.01" required />
                        </div>
                        <div className="form-group">
                            <label>Capacidad </label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min={0} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Categoria </label>
                        <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                            <option value="">Selecciona una categoria</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear evento"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
