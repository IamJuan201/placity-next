"use client"

import { useState } from "react";
import type { Category, CreateCategory } from "../types/category";
import { createCategory, updateCategory } from "../services/categoryService";

interface CategoryFormModalProps {
    category?: Category | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function CategoryFormModal({ category, onClose, onSaved }: CategoryFormModalProps) {
    const isEditing = !!category
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: category?.name ?? "",
        description: category?.description ?? "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)
        try {
            const data: CreateCategory = formData
            if (isEditing) {
                await updateCategory(data, category.id)
            } else {
                await createCategory(data)
            }
            onSaved()
            onClose()
        } catch {
            setError("No se pudo guardar la categoria")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditing ? "Editar categoria" : "Nueva categoria"}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre </label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Descripcion</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear categoria"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
