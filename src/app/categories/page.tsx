"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Category } from "@/types/category"
import { getCategories, deleteCategory } from "@/services/categoryService"
import CategoryItem from "@/components/Category"
import CategoryFormModal from "@/components/CategoryFormModal"
import { useAuth } from "@/context/authContext"

export default function CategoriesPage() {
    const { user, role, isLoading: isAuthLoading } = useAuth()
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    const fetchCategories = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await getCategories()
            setCategories(data)
        } catch {
            setError("No se pudieron cargar las categorias")
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
        fetchCategories()
    }, [user, isAuthLoading])

    if (isAuthLoading) {
        return <main className="events-page"><p>Cargando...</p></main>
    }

    if (!user) {
        return null
    }

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Seguro que quieres eliminar esta categoria?")) return
        try {
            await deleteCategory(id)
            fetchCategories()
        } catch {
            setError("No se pudo eliminar la categoria")
        }
    }

    const handleNew = () => {
        setEditingCategory(null)
        setModalOpen(true)
    }

    return (
        <main className="events-page">
            <div className="events-header">
                <h1>Categorias</h1>
                {role === "admin" && (
                    <button className="btn-primary" onClick={handleNew}>
                        Nueva categoria
                    </button>
                )}
            </div>

            {isLoading && <p>Cargando...</p>}
            {error && <p className="error-msg">{error}</p>}

            {!isLoading && categories.length === 0 && !error && (
                <div className="empty-state">
                    <p>No hay categorias todavia.</p>
                </div>
            )}

            <div className="category-list">
                {categories.map((cat) => (
                    <CategoryItem
                        key={cat.id}
                        category={cat}
                        isAdmin={role === "admin"}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {modalOpen && (
                <CategoryFormModal
                    category={editingCategory}
                    onClose={() => setModalOpen(false)}
                    onSaved={fetchCategories}
                />
            )}
        </main>
    )
}